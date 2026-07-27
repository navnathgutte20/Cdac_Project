package com.farmafriend.erp.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.farmafriend.erp.constants.ProductCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Product catalog + inventory in a single table (single stock pool per product,
 * optionally tied to the dealer responsible for fulfilling it).
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false)
    private String productName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(length = 2000)
    private String description;

    /** Ledger / account code this product is booked against */
    private String account;

    private String imageUrl;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdDate;

    /** Dealer responsible for stocking/fulfilling this product (nullable until assigned) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_id")
    private User dealer;

    @Builder.Default
    private Integer stockQuantity = 0;

    @Builder.Default
    private Integer availableStock = 0;

    @Builder.Default
    private Integer reservedStock = 0;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }
}
