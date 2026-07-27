package com.farmafriend.erp.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * Used by a DEALER to set the stock quantity on one of their own products.
 * The product id comes from the path and the dealer from the authenticated
 * user, so only the new quantity needs to travel in the body.
 */
@Data
public class StockQuantityRequest {

    @NotNull
    @PositiveOrZero
    private Integer stockQuantity;
}
