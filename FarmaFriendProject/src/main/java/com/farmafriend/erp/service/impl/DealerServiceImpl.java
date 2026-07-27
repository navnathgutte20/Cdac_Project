package com.farmafriend.erp.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.dto.request.DealerProductRequest;
import com.farmafriend.erp.dto.request.InventoryUpdateRequest;
import com.farmafriend.erp.dto.response.InventoryResponse;
import com.farmafriend.erp.entity.Product;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.exception.BadRequestException;
import com.farmafriend.erp.exception.ResourceNotFoundException;
import com.farmafriend.erp.repository.ProductRepository;
import com.farmafriend.erp.repository.UserRepository;
import com.farmafriend.erp.service.DealerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DealerServiceImpl implements DealerService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventoryForDealer(Long dealerId) {

        List<Product> products = productRepository.findByDealer_UserId(dealerId);

        return products.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public InventoryResponse updateStock(@Valid InventoryUpdateRequest request) {
        Product product = findOwnedProduct(request.getDealerId(), request.getProductId());
        applyStockQuantity(product, request.getStockQuantity());
        productRepository.save(product);
        return toResponse(product);
    }

    @Override
    @Transactional
    public InventoryResponse addProductToInventory(Long dealerId, DealerProductRequest request) {
        User dealer = userRepository.findById(dealerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found with id: " + dealerId));
        if (dealer.getRole() != RoleName.DEALER) {
            throw new BadRequestException("Only dealer accounts can add products to a dealer inventory");
        }

        Product product = Product.builder()
                .productName(request.getProductName())
                .category(request.getCategory())
                .price(request.getPrice())
                .description(request.getDescription())
                .account(request.getAccount())
                .imageUrl(request.getImageUrl())
                .active(true)
                .dealer(dealer)
                .stockQuantity(request.getInitialStock())
                .availableStock(request.getInitialStock())
                .reservedStock(0)
                .build();

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Override
    @Transactional
    public InventoryResponse adjustOwnStock(Long dealerId, Long productId, Integer stockQuantity) {
        Product product = findOwnedProduct(dealerId, productId);
        applyStockQuantity(product, stockQuantity);
        productRepository.save(product);
        return toResponse(product);
    }

    @Override
    @Transactional
    public void removeProductFromInventory(Long dealerId, Long productId) {
        Product product = findOwnedProduct(dealerId, productId);
        product.setActive(false);
        productRepository.save(product);
    }

    private Product findOwnedProduct(Long dealerId, Long productId) {
        Product product = productRepository.findByDealer_UserIdAndProductId(dealerId, productId);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found in this dealer's inventory with id: " + productId);
        }
        return product;
    }

    private void applyStockQuantity(Product product, Integer stockQuantity) {
        product.setStockQuantity(stockQuantity);
        int reserved = product.getReservedStock() == null ? 0 : product.getReservedStock();
        product.setAvailableStock(Math.max(stockQuantity - reserved, 0));
    }

    private InventoryResponse toResponse(Product product) {
        User dealer = product.getDealer();
        return InventoryResponse.builder()
                .dealerId(dealer != null ? dealer.getUserId() : null)
                .dealerName(dealer != null ? dealer.getName() : null)
                .productId(product.getProductId())
                .productName(product.getProductName())
                .category(product.getCategory())
                .price(product.getPrice())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .availableStock(product.getAvailableStock())
                .stockQuantity(product.getStockQuantity())
                .reservedStock(product.getReservedStock())
                .build();
    }
}
