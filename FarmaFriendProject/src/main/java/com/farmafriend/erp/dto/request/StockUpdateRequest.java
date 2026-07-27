package com.farmafriend.erp.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockUpdateRequest {
    @NotNull
    private Long dealerId;
    @NotNull
    private Long productId;
    @NotNull
    private Integer stockQuantity;
}
