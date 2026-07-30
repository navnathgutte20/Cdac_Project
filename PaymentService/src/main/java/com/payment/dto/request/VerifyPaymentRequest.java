package com.payment.dto.request;

import lombok.Data;

@Data
public class VerifyPaymentRequest {

	private String orderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
   
}