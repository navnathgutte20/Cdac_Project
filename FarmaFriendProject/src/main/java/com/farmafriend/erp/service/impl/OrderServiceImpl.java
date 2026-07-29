package com.farmafriend.erp.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmafriend.erp.constants.OrderStatus;
import com.farmafriend.erp.constants.PaymentStatus;
import com.farmafriend.erp.constants.ShipmentStatus;
import com.farmafriend.erp.dto.request.OrderRequest;
import com.farmafriend.erp.dto.request.PaymentInitiateRequest;
import com.farmafriend.erp.dto.request.ShipmentCreateRequest;
import com.farmafriend.erp.dto.response.CartItemResponse;
import com.farmafriend.erp.dto.response.OrderItemResponse;
import com.farmafriend.erp.dto.response.OrderResponse;
import com.farmafriend.erp.dto.response.PageResponse;
import com.farmafriend.erp.entity.CartItem;
import com.farmafriend.erp.entity.DeliveryAddress;
import com.farmafriend.erp.entity.Order;
import com.farmafriend.erp.entity.OrderItem;
import com.farmafriend.erp.entity.Product;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.exception.BadRequestException;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.CartItemRepository;
import com.farmafriend.erp.repository.DeliveryAddressRepository;
import com.farmafriend.erp.repository.OrderRepository;
import com.farmafriend.erp.repository.ProductRepository;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.service.OrderService;
import com.farmafriend.erp.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final ProductRepository productRepository;
    private final com.farmafriend.erp.service.EmailService emailService;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long customerId, OrderRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        List<CartItem> allCartItems = cartItemRepository.findByCustomer_UserId(customerId);
        if (allCartItems.isEmpty()) {
            throw new BadRequestException("Cannot place an order with an empty cart");
        }

        List<CartItem> cartItems;
        if (request.getCartItemIds() != null && !request.getCartItemIds().isEmpty()) {
            Set<Long> selectedIds = new HashSet<>(request.getCartItemIds());
            cartItems = allCartItems.stream()
                    .filter(ci -> selectedIds.contains(ci.getCartItemId()))
                    .toList();
            if (cartItems.size() != selectedIds.size()) {
                throw new BadRequestException("One or more selected cart items were not found in your cart");
            }
        } else {
            cartItems = allCartItems;
        }

        DeliveryAddress address = deliveryAddressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery address not found with id: " + request.getAddressId()));

        BigDecimal total = BigDecimal.ZERO;
        Order order = Order.builder()
                .customer(customer)
                .deliveryAddress(address)
                .status(OrderStatus.CREATED)
                .totalAmount(BigDecimal.ZERO)
                .orderItems(new ArrayList<>())
                .build();

        for (CartItem ci : cartItems) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(ci.getProduct())
                    .quantity(ci.getQuantity())
                    .price(ci.getUnitPrice())
                    .build();
            order.getOrderItems().add(item);
            total = total.add(ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        order.setTotalAmount(total);
        order = orderRepository.save(order);

        // Only the cart items that were actually checked out leave the cart;
        // anything not selected stays behind for a later order.
        cartItemRepository.deleteAll(cartItems);

        emailService.sendOrderSuccessEmail(order);

        return toResponse(order);
    }
   
    @Transactional(readOnly = true)
    public OrderItemResponse getOrder(Long id) {

        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        assertCanViewOrder(order);
        return toOrderItemResponse(order);
    }

    /**
     * Guards {@link #getOrder(Long)} against IDOR access: a customer may only
     * view their own orders, a dealer only orders assigned to them, and a
     * representative executive only orders belonging to their own customers.
     * Admins can view any order.
     */
    private void assertCanViewOrder(Order order) {
        String role = SecurityUtils.getCurrentUserRole();
        Long currentUserId = SecurityUtils.getCurrentUserId();

        boolean allowed = switch (role) {
            case "ADMIN" -> true;
            case "CUSTOMER" -> order.getCustomer() != null && order.getCustomer().getUserId().equals(currentUserId);
            case "DEALER" -> order.getDealer() != null && order.getDealer().getUserId().equals(currentUserId);
            case "REPRESENTATIVE_EXECUTIVE" -> order.getCustomer() != null
                    && order.getCustomer().getRepresentative() != null
                    && order.getCustomer().getRepresentative().getUserId().equals(currentUserId);
            default -> false;
        };

        if (!allowed) {
            // Reported as "not found" rather than "forbidden" so an
            // unauthorized caller can't use this to confirm an order id exists.
            throw new ResourceNotFoundException("Order not found");
        }
    }
    @Transactional
    @Override
    public PageResponse<OrderResponse> getOrdersForCustomer(Long customerId, Pageable pageable) {
        Page<Order> page = orderRepository.findByCustomer_UserId(customerId, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> page = orderRepository.findAll(pageable);
        return PageResponse.from(page.map(this::toResponse));
    }
    @Transactional
    @Override
    public PageResponse<OrderResponse> getOrdersForDealer(Long dealerId, Pageable pageable) {
        Page<Order> page = orderRepository.findByDealer_UserId(dealerId, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }
    @Transactional
    @Override
    public PageResponse<OrderResponse> getUnclaimedOrders(Pageable pageable) {
        Page<Order> page = orderRepository.findByDealerIsNullAndStatusNot(OrderStatus.CANCELLED, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long customerId) {
        Order order = findOrder(orderId);
        if (!order.getCustomer().getUserId().equals(customerId)) {
            throw new BadRequestException("You are not authorized to cancel this order");
        }
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.SHIPPED) {
            throw new BadRequestException("Order cannot be cancelled once shipped or delivered");
        }
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return toResponse(order);
    }
    
    @Override
    @Transactional
    public OrderResponse getInvoice(Long orderId) {
        return toResponse(findOrder(orderId));
    }

    @Override
    @Transactional
    public OrderResponse initiatePayment(PaymentInitiateRequest request) {
        Order order = findOrder(request.getOrderId());
        if (order.getPaymentStatus() != null) {
            throw new BadRequestException("Payment already exists for this order");
        }
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentGateway(request.getPaymentGateway());
        order.setPaymentDate(LocalDateTime.now());
        order.setTransactionRef("TXN" + System.currentTimeMillis());
        order.setPaymentStatus(request.getPaymentMethod().name().equals("CASH_ON_DELIVERY")
                ? PaymentStatus.PENDING
                : PaymentStatus.SUCCESS);
        orderRepository.save(order);
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse createShipment(ShipmentCreateRequest request) {
        Order order = findOrder(request.getOrderId());
        if (order.getTrackingNumber() != null) {
            throw new BadRequestException("Shipment already exists for this order");
        }
        User dealer = userRepository.findById(request.getDealerId())
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found with id: " + request.getDealerId()));

        order.setDealer(dealer);
        order.setTrackingNumber("TRK" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        order.setShipmentStatus(ShipmentStatus.PENDING);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateShipmentStatus(Long orderId, String status) {
        Order order = findOrder(orderId);
        ShipmentStatus newStatus;
        try {
            newStatus = ShipmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid shipment status: " + status);
        }
        order.setShipmentStatus(newStatus);
        if (newStatus == ShipmentStatus.DISPATCHED) {
            order.setShipmentDate(LocalDateTime.now());
            order.setStatus(OrderStatus.SHIPPED);
            deductInventoryStock(order);
            orderRepository.save(order);
            initializeForEmail(order);
            emailService.sendShipmentEmail(order);
            return toResponse(order);
        } else if (newStatus == ShipmentStatus.DELIVERED) {
            order.setStatus(OrderStatus.DELIVERED);
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            deductInventoryStock(order);
            
            orderRepository.save(order);
            initializeForEmail(order);
            emailService.sendDeliveryEmail(order);
            return toResponse(order);
        } else if (newStatus == ShipmentStatus.CANCELLED) {
            order.setStatus(OrderStatus.CANCELLED);
            restoreInventoryStock(order);
        }
        orderRepository.save(order);
        return toResponse(order);
    }

    /**
     * Reduces each ordered product's stock once the shipment actually leaves
     * the dealer (DISPATCHED) or reaches the customer (DELIVERED). Guarded by
     * {@code stockDeducted} so re-fetching/re-setting the same or a later
     * status never deducts the same order twice.
     */
    private void deductInventoryStock(Order order) {
        if (order.isStockDeducted()) {
            return;
        }
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            int quantity = item.getQuantity();

            int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            int currentAvailable = product.getAvailableStock() == null ? 0 : product.getAvailableStock();

            product.setStockQuantity(Math.max(currentStock - quantity, 0));
            product.setAvailableStock(Math.max(currentAvailable - quantity, 0));
            productRepository.save(product);
        }
        order.setStockDeducted(true);
    }

    /** If a shipment is cancelled after stock was already deducted, put the units back. */
    private void restoreInventoryStock(Order order) {
        if (!order.isStockDeducted()) {
            return;
        }
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            int quantity = item.getQuantity();

            int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            int currentAvailable = product.getAvailableStock() == null ? 0 : product.getAvailableStock();

            product.setStockQuantity(currentStock + quantity);
            product.setAvailableStock(currentAvailable + quantity);
            productRepository.save(product);
        }
        order.setStockDeducted(false);
    }

    @Override
    public OrderResponse trackShipment(String trackingNumber) {
        Order order = orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("No shipment found with tracking number: " + trackingNumber));
        return toResponse(order);
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    /**
     * Emails are sent on a separate thread via {@code @Async}, which runs
     * after this transaction's Hibernate session is gone. Any lazy
     * association touched for the first time on that thread would throw
     * LazyInitializationException, so we resolve everything the email
     * templates need here first, while the session is still open.
     */
    private void initializeForEmail(Order order) {
        if (order.getCustomer() != null) {
            order.getCustomer().getName();
            order.getCustomer().getEmail();
        }
        order.getOrderItems().forEach(item -> {
            if (item.getProduct() != null) {
                item.getProduct().getProductName();
            }
        });
        if (order.getDeliveryAddress() != null) {
            order.getDeliveryAddress().getAddressLine();
            order.getDeliveryAddress().getCity();
            order.getDeliveryAddress().getState();
            order.getDeliveryAddress().getPincode();
        }
    }

    private OrderResponse toResponse(Order order) {
        List<CartItemResponse> items = order.getOrderItems().stream()
                .map(oi -> CartItemResponse.builder()
                        .productId(oi.getProduct().getProductId())
                        .productName(oi.getProduct().getProductName())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getPrice())
                        .subTotal(oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                        .build())
                .toList();
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .customerId(order.getCustomer().getUserId())
                .customerName(order.getCustomer().getName())
                .items(items)
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .paymentDate(order.getPaymentDate())
                .transactionRef(order.getTransactionRef())
                .paymentGateway(order.getPaymentGateway())
                .trackingNumber(order.getTrackingNumber())
                .shipmentStatus(order.getShipmentStatus())
                .shipmentDate(order.getShipmentDate())
                .dealerId(order.getDealer() != null ? order.getDealer().getUserId() : null)
                .dealerName(order.getDealer() != null ? order.getDealer().getName() : null)
                .build();
    }
    
    private OrderItemResponse toOrderItemResponse(Order order) {
        List<CartItemResponse> items = order.getOrderItems().stream()
                .map(oi -> CartItemResponse.builder()
                        .productId(oi.getProduct().getProductId())
                        .productName(oi.getProduct().getProductName())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getPrice())
                        .subTotal(oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                        .build())
                .toList();
        return OrderItemResponse.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .build();
    }
}
