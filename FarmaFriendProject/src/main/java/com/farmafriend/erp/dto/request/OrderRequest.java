package com.farmafriend.erp.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull
    private Long addressId;

    /**
     * Optional subset of the customer's cart items to check out. When omitted
     * or empty, every item currently in the cart is ordered (the previous
     * "checkout everything" behaviour). When provided, only these cart items
     * are converted into the order and removed from the cart — the rest stay
     * in the cart untouched.
     */
    private List<Long> cartItemIds;
}
