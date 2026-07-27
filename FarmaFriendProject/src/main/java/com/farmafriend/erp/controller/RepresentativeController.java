package com.farmafriend.erp.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.dto.request.RepresentativeCustomerRequest;
import com.farmafriend.erp.dto.response.OrderResponse;
import com.farmafriend.erp.dto.response.PageResponse;
import com.farmafriend.erp.dto.response.UserResponse;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.exception.BadRequestException;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.service.RepresentativeService;
import com.farmafriend.erp.utils.ApiResponse;
import com.farmafriend.erp.utils.SecurityUtils;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/re")
@RequiredArgsConstructor
@Tag(name = "Representative Executives", description = "RE customer portfolio, order visibility, and field onboarding")
public class RepresentativeController {

    private final UserRepository userRepository;
    private final RepresentativeService representativeService;

    // ---- Self-service: the authenticated representative executive's own portfolio ----

    @GetMapping("/customers")
    @PreAuthorize("hasRole('REPRESENTATIVE_EXECUTIVE')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> myCustomers() {
        List<UserResponse> customers = representativeService.getMyCustomers(SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @GetMapping("/customers/{id}")
    @PreAuthorize("hasRole('REPRESENTATIVE_EXECUTIVE')")
    public ResponseEntity<ApiResponse<UserResponse>> myCustomer(@PathVariable Long id) {
        UserResponse customer = representativeService.getMyCustomer(SecurityUtils.getCurrentUserId(), id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @GetMapping("/customers/{id}/orders")
    @PreAuthorize("hasRole('REPRESENTATIVE_EXECUTIVE')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> customerOrders(@PathVariable Long id,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        PageResponse<OrderResponse> orders = representativeService.getCustomerOrders(SecurityUtils.getCurrentUserId(),
                id, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping("/customers")
    @PreAuthorize("hasRole('REPRESENTATIVE_EXECUTIVE')")
    public ResponseEntity<ApiResponse<UserResponse>> onboardCustomer(
            @Valid @RequestBody RepresentativeCustomerRequest request) {
        UserResponse response = representativeService.registerCustomer(SecurityUtils.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer onboarded successfully", response));
    }

    // ---- Admin lookups ----

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllRepresentatives() {
        List<UserResponse> reps = userRepository.findByRole(RoleName.REPRESENTATIVE_EXECUTIVE).stream()
                .map(this::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(reps));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getRepresentative(@PathVariable Long id) {
        User rep = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Representative executive not found with id: " + id));
        if (rep.getRole() != RoleName.REPRESENTATIVE_EXECUTIVE) {
            throw new BadRequestException("The specified user is not a Representative Executive");
        }
        return ResponseEntity.ok(ApiResponse.success(toResponse(rep)));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .location(user.getLocation())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
