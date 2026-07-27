package com.farmafriend.erp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalCustomers;
    private long totalDealers;
    private long totalProducts;
    private long totalOrders;
    private long totalShipments;
    private BigDecimal totalRevenue;
}
