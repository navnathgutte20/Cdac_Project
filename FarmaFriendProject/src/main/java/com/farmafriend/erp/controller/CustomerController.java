package com.farmafriend.erp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.dto.response.UserResponse;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.exception.BadRequestException;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.utils.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customers", description = "Customer profile listing and Representative Executive assignment")
public class CustomerController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(findCustomer(id))));
    }
   
    
    private User findCustomer(Long id) {
        User customer = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        if (customer.getRole() != RoleName.CUSTOMER) {
            throw new BadRequestException("The specified user is not a customer");
        }
      //  System.out.println(customer.getPhone()+"--->"+customer.getAddress());
        return customer;
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','REPRESENTATIVE_EXECUTIVE')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllCustomers() {
        List<UserResponse> customers = userRepository.findByRole(RoleName.CUSTOMER).stream().map(this::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @PutMapping("/{id}/assign-re/{reId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> assignRe(@PathVariable Long id, @PathVariable Long reId) {
        User customer = findCustomer(id);
        User re = userRepository.findById(reId)
                .orElseThrow(() -> new ResourceNotFoundException("Representative executive not found with id: " + reId));
        if (re.getRole() != RoleName.REPRESENTATIVE_EXECUTIVE) {
            throw new BadRequestException("The specified user is not a Representative Executive");
        }
        customer.setRepresentative(re);
        userRepository.save(customer);
        return ResponseEntity.ok(ApiResponse.success("Representative executive assigned", toResponse(customer)));
    }

   

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress())
                .representativeName(user.getRepresentative() != null ? user.getRepresentative().getName() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
