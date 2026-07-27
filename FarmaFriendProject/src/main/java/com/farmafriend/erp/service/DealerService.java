package com.farmafriend.erp.service;

import java.util.List;

import com.farmafriend.erp.dto.request.DealerProductRequest;
import com.farmafriend.erp.dto.request.InventoryUpdateRequest;
import com.farmafriend.erp.dto.response.InventoryResponse;

import jakarta.validation.Valid;

public interface DealerService {

	List<InventoryResponse> getInventoryForDealer(Long dealerId);

	InventoryResponse updateStock(@Valid InventoryUpdateRequest request);

	/** Dealer adds a brand-new product straight into their own inventory */
	InventoryResponse addProductToInventory(Long dealerId, @Valid DealerProductRequest request);

	/** Dealer updates the stock quantity of a product already in their own inventory */
	InventoryResponse adjustOwnStock(Long dealerId, Long productId, Integer stockQuantity);

	/** Dealer deactivates one of their own products (soft delete) */
	void removeProductFromInventory(Long dealerId, Long productId);

}
