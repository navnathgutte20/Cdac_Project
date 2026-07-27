package com.farmafriend.erp.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.farmafriend.erp.dto.request.RepresentativeCustomerRequest;
import com.farmafriend.erp.dto.response.OrderResponse;
import com.farmafriend.erp.dto.response.PageResponse;
import com.farmafriend.erp.dto.response.UserResponse;

public interface RepresentativeService {

    /** All customers currently assigned to this representative executive */
    List<UserResponse> getMyCustomers(Long representativeId);

    /** A single customer assigned to this representative executive */
    UserResponse getMyCustomer(Long representativeId, Long customerId);

    /** Order history for a customer, only if that customer is assigned to this representative executive */
    PageResponse<OrderResponse> getCustomerOrders(Long representativeId, Long customerId, Pageable pageable);

    /** Field onboarding: representative registers a new customer, auto-assigned to themselves */
    UserResponse registerCustomer(Long representativeId, RepresentativeCustomerRequest request);
}
