package com.payment.dto.response;

import com.payment.entity.PaymentStatus;

import lombok.Data;

@Data
public class PaymentStatusResponse {
    private Long orderId;
    private PaymentStatus status;
    private String razorpayPaymentId;
}