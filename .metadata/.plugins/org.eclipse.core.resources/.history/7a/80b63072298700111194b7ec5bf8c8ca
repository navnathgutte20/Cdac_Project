package com.farmafriend.erp.controller;

import com.farmafriend.erp.entity.DeliveryAddress;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.dto.request.DeliveryAddressRequest;
import com.farmafriend.erp.dto.response.DeliveryAddressResponse;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.DeliveryAddressRepository;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.utils.ApiResponse;
import com.farmafriend.erp.utils.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
@Tag(name = "Delivery Addresses", description = "Customer delivery address book")
public class DeliveryAddressController {

    private final DeliveryAddressRepository deliveryAddressRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryAddressResponse>>> getMyAddresses() {

        List<DeliveryAddressResponse> response =
                deliveryAddressRepository.findByCustomer_UserId(SecurityUtils.getCurrentUserId())
                        .stream()
                        .map(address -> DeliveryAddressResponse.builder()
                                .addressId(address.getAddressId())
                                .addressLine(address.getAddressLine())
                                .city(address.getCity())
                                .state(address.getState())
                                .pincode(address.getPincode())
                                .build())
                        .toList();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeliveryAddress>> addAddress(@Valid @RequestBody DeliveryAddressRequest request) {
        User customer = userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for this account"));
        DeliveryAddress address = DeliveryAddress.builder()
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .customer(customer)
                .build();
        address = deliveryAddressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Address added", address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        DeliveryAddress address = deliveryAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));
        deliveryAddressRepository.delete(address);
        return ResponseEntity.ok(ApiResponse.success("Address removed", null));
    }
}
