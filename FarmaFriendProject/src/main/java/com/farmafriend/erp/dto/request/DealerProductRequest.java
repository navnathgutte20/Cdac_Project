package com.farmafriend.erp.dto.request;

import java.math.BigDecimal;

import com.farmafriend.erp.constants.ProductCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * Payload a DEALER uses to add a brand-new product straight into their own
 * inventory. The dealer is inferred from the authenticated user, never from
 * the request body.
 */
@Data
public class DealerProductRequest {

    @NotBlank
    private String productName;

    @NotNull
    private ProductCategory category;

    @NotNull
    @Positive
    private BigDecimal price;

    private String description;

    private String account;

    private String imageUrl;

    /** Starting stock the dealer currently holds for this product */
    @NotNull
    @PositiveOrZero
    private Integer initialStock;
}
