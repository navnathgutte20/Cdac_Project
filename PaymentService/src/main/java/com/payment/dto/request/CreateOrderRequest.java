package com.payment.dto.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateOrderRequest {

    private Long orderId;

    private BigDecimal amount;

}