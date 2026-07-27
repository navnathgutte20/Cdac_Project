package com.farmafriend.erp.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.farmafriend.erp.constants.OrderStatus;
import com.farmafriend.erp.constants.PaymentStatus;
import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.constants.ShipmentStatus;
import com.farmafriend.erp.dto.response.AdminDashboardResponse;
import com.farmafriend.erp.dto.response.DealerDashboardResponse;
import com.farmafriend.erp.dto.response.RepresentativeDashboardResponse;
import com.farmafriend.erp.entity.Order;
import com.farmafriend.erp.entity.Product;
import com.farmafriend.erp.repository.OrderRepository;
import com.farmafriend.erp.repository.ProductRepository;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.SUCCESS)
                .map(com.farmafriend.erp.entity.Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long shipmentCount = orderRepository.findAll().stream()
                .filter(o -> o.getTrackingNumber() != null)
                .count();

        return AdminDashboardResponse.builder()
                .totalCustomers(userRepository.findByRole(RoleName.CUSTOMER).size())
                .totalDealers(userRepository.findByRole(RoleName.DEALER).size())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .totalShipments(shipmentCount)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public DealerDashboardResponse getDealerDashboard(Long dealerId) {
        List<Product> products = productRepository.findByDealer_UserId(dealerId);

        long totalProducts = products.size();
        long totalStockUnits = products.stream()
                .mapToLong(p -> p.getStockQuantity() == null ? 0 : p.getStockQuantity())
                .sum();
        long lowStockProducts = products.stream()
                .filter(p -> p.getAvailableStock() != null && p.getAvailableStock() < LOW_STOCK_THRESHOLD)
                .count();

        List<Order> dealerOrders = orderRepository.findByDealer_UserId(dealerId, Pageable.unpaged()).getContent();
        long totalOrders = dealerOrders.size();
        long pendingShipments = dealerOrders.stream()
                .filter(o -> o.getShipmentStatus() == null || o.getShipmentStatus() == ShipmentStatus.PENDING)
                .count();
        BigDecimal totalRevenue = dealerOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.SUCCESS)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DealerDashboardResponse.builder()
                .totalProducts(totalProducts)
                .totalStockUnits(totalStockUnits)
                .lowStockProducts(lowStockProducts)
                .totalOrders(totalOrders)
                .pendingShipments(pendingShipments)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public RepresentativeDashboardResponse getRepresentativeDashboard(Long representativeId) {
        long totalCustomers = userRepository.findByRepresentative_UserId(representativeId).size();

        List<Order> orders = orderRepository.findByCustomer_Representative_UserId(representativeId);
        long totalOrders = orders.size();
        long pendingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CREATED || o.getStatus() == OrderStatus.CONFIRMED)
                .count();
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.SUCCESS)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return RepresentativeDashboardResponse.builder()
                .totalCustomers(totalCustomers)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .totalRevenue(totalRevenue)
                .build();
    }
}
