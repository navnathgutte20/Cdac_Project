package com.farmafriend.erp.dto.request;

import com.farmafriend.erp.constants.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentInitiateRequest {
    @NotNull
    private Long orderId;
    @NotNull
    private PaymentMethod paymentMethod;
    private String paymentGateway;
}
