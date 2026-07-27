package com.farmafriend.erp.dto.response;

import java.math.BigDecimal;

import com.farmafriend.erp.constants.ProductCategory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class InventoryResponse {
	private Long dealerId;
	private String dealerName;
	private Long productId;
	private String productName;
	private ProductCategory category;
	private BigDecimal price;
	private String description;
	private String imageUrl;
	private boolean active;
	private Integer stockQuantity;
	private Integer availableStock;
	private Integer reservedStock;
}
