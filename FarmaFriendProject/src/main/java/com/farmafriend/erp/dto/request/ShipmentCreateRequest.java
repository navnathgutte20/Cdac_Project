package com.farmafriend.erp.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShipmentCreateRequest {
    @NotNull
    private Long orderId;
    @NotNull
    private Long dealerId;
}
