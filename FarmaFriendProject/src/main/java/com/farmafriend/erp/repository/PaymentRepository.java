package com.farmafriend.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.farmafriend.erp.entity.Payment;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> ,JpaSpecificationExecutor<Payment> {

}
