package com.farmafriend.erp.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DealerDashboardResponse {
    private long totalProducts;
    private long totalStockUnits;
    private long lowStockProducts;
    private long totalOrders;
    private long pendingShipments;
    private BigDecimal totalRevenue;
}
