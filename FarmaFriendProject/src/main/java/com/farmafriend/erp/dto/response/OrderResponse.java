package com.farmafriend.erp.dto.response;

import com.farmafriend.erp.constants.OrderStatus;
import com.farmafriend.erp.constants.PaymentMethod;
import com.farmafriend.erp.constants.PaymentStatus;
import com.farmafriend.erp.constants.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private Long customerId;
    private String customerName;
    private List<CartItemResponse> items;

    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String transactionRef;
    private String paymentGateway;

    private String trackingNumber;
    private ShipmentStatus shipmentStatus;
    private LocalDateTime shipmentDate;
    private Long dealerId;
    private String dealerName;
}
