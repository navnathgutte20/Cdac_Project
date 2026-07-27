package com.farmafriend.erp.dto.request;

import java.math.BigDecimal;

import com.farmafriend.erp.constants.ProductCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank
    private String productName;

    private ProductCategory category;

    @NotNull
    @Positive
    private BigDecimal price;

    private String description;

    private String account;

    private String imageUrl;

    /** Optional: assign a dealer as the fulfilling dealer for this product */
    private Long dealerId;
}
