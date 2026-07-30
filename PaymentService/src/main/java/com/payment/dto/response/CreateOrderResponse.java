package com.payment.dto.response;

import lombok.Data;

@Data
public class CreateOrderResponse {

    private String razorpayOrderId;

    private Integer amount;

    private String currency;

    private String key;


}