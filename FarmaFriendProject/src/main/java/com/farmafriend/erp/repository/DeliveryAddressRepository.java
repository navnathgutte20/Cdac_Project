package com.farmafriend.erp.repository;

import com.farmafriend.erp.entity.DeliveryAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {
	@Query("SELECT d FROM DeliveryAddress d WHERE d.customer.userId = :customerId")
	List<DeliveryAddress> findByCustomer_UserId(Long customerId);
}
