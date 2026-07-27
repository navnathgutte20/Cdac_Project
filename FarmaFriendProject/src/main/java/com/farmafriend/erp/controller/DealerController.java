package com.farmafriend.erp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.dto.request.DealerProductRequest;
import com.farmafriend.erp.dto.request.InventoryUpdateRequest;
import com.farmafriend.erp.dto.request.StockQuantityRequest;
import com.farmafriend.erp.dto.response.InventoryResponse;
import com.farmafriend.erp.dto.response.UserResponse;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.exception.BadRequestException;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.service.DealerService;
import com.farmafriend.erp.utils.ApiResponse;
import com.farmafriend.erp.utils.SecurityUtils;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dealer")
@RequiredArgsConstructor
@Tag(name = "Dealers", description = "Dealer profile listing and self-service inventory management")
public class DealerController {

    private final UserRepository userRepository;
    private final DealerService dealerService;

    // ---- Self-service inventory (the authenticated dealer manages their own stock) ----

    @PostMapping("/inventory/products")
    @PreAuthorize("hasRole('DEALER')")
    public ResponseEntity<ApiResponse<InventoryResponse>> addProduct(@Valid @RequestBody DealerProductRequest request) {
        InventoryResponse response = dealerService.addProductToInventory(SecurityUtils.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product added to your inventory", response));
    }

    @GetMapping("/my-inventory")
    @PreAuthorize("hasRole('DEALER')")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> myInventory() {
        List<InventoryResponse> inventory = dealerService.getInventoryForDealer(SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(inventory));
    }

    @PutMapping("/inventory/{productId}/stock")
    @PreAuthorize("hasRole('DEALER')")
    public ResponseEntity<ApiResponse<InventoryResponse>> adjustOwnStock(@PathVariable Long productId,
            @Valid @RequestBody StockQuantityRequest request) {
        InventoryResponse response = dealerService.adjustOwnStock(SecurityUtils.getCurrentUserId(), productId,
                request.getStockQuantity());
        return ResponseEntity.ok(ApiResponse.success("Stock updated", response));
    }

    @DeleteMapping("/inventory/{productId}")
    @PreAuthorize("hasRole('DEALER')")
    public ResponseEntity<ApiResponse<Void>> removeProduct(@PathVariable Long productId) {
        dealerService.removeProductFromInventory(SecurityUtils.getCurrentUserId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed from your inventory", null));
    }

    // ---- Admin / general inventory lookups ----

    @GetMapping("/{id}/inventory")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getInventory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dealerService.getInventoryForDealer(id)));
    }

    @PutMapping("/inventory")
    @PreAuthorize("hasAnyRole('ADMIN','DEALER')")
    public ResponseEntity<ApiResponse<InventoryResponse>> updateStock(@Valid @RequestBody InventoryUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Stock updated", dealerService.updateStock(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllDealers() {
        List<UserResponse> dealers = userRepository.findByRole(RoleName.DEALER).stream().map(this::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(dealers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getDealer(@PathVariable Long id) {
        User dealer = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found with id: " + id));
        if (dealer.getRole() != RoleName.DEALER) {
            throw new BadRequestException("The specified user is not a dealer");
        }
        return ResponseEntity.ok(ApiResponse.success(toResponse(dealer)));
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
