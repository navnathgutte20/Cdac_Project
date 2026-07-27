package com.farmafriend.erp.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Pageable;

import com.farmafriend.erp.dto.request.ProductRequest;
import com.farmafriend.erp.dto.response.PageResponse;
import com.farmafriend.erp.dto.response.ProductResponse;

import jakarta.validation.Valid;

public interface ProductService {

	

	public PageResponse<ProductResponse> searchProducts(String name, String category, BigDecimal minPrice,
			BigDecimal maxPrice, Pageable pageable);

	public Object updateProduct(Long id, @Valid ProductRequest request);

	public void deleteProduct(Long id);

	public ProductResponse createProduct(@Valid ProductRequest request);

	public Object getProduct(Long id);

}
