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
public class RepresentativeDashboardResponse {
    private long totalCustomers;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
}
