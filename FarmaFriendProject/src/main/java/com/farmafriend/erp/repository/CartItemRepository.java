package com.farmafriend.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.farmafriend.erp.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	@EntityGraph(attributePaths = {"product"})
	List<CartItem> findByCustomer_UserId(Long customerId);

	Optional<CartItem> findByCustomer_UserIdAndProduct_ProductId(Long customerId, Long productId);

	void deleteByCustomer_UserId(Long customerId);
}
