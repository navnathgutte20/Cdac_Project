package com.farmafriend.erp.service.impl;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.dto.request.RepresentativeCustomerRequest;
import com.farmafriend.erp.dto.response.OrderResponse;
import com.farmafriend.erp.dto.response.PageResponse;
import com.farmafriend.erp.dto.response.UserResponse;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.exception.BadRequestException;
import com.farmafriend.erp.exception.DuplicateResourceException;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.service.OrderService;
import com.farmafriend.erp.service.RepresentativeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepresentativeServiceImpl implements RepresentativeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderService orderService;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getMyCustomers(Long representativeId) {
        return userRepository.findByRepresentative_UserId(representativeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyCustomer(Long representativeId, Long customerId) {
        return toResponse(findOwnedCustomer(representativeId, customerId));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getCustomerOrders(Long representativeId, Long customerId, Pageable pageable) {
        User customer = findOwnedCustomer(representativeId, customerId);
        return orderService.getOrdersForCustomer(customer.getUserId(), pageable);
    }

    @Override
    @Transactional
    public UserResponse registerCustomer(Long representativeId, RepresentativeCustomerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account already exists with this email");
        }
        User representative = userRepository.findById(representativeId)
                .orElseThrow(() -> new ResourceNotFoundException("Representative executive not found with id: " + representativeId));

        User customer = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .location(request.getAddress())
                .role(RoleName.CUSTOMER)
                .representative(representative)
                .enabled(true)
                .build();
        customer = userRepository.save(customer);
        return toResponse(customer);
    }

    private User findOwnedCustomer(Long representativeId, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        if (customer.getRole() != RoleName.CUSTOMER) {
            throw new BadRequestException("The specified user is not a customer");
        }
        if (customer.getRepresentative() == null || !customer.getRepresentative().getUserId().equals(representativeId)) {
            throw new BadRequestException("This customer is not assigned to you");
        }
        return customer;
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress())
                .location(user.getLocation())
                .representativeName(user.getRepresentative() != null ? user.getRepresentative().getName() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
