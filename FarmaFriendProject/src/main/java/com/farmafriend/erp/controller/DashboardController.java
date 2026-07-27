package com.farmafriend.erp.controller;

import com.farmafriend.erp.dto.response.AdminDashboardResponse;
import com.farmafriend.erp.dto.response.DealerDashboardResponse;
import com.farmafriend.erp.dto.response.RepresentativeDashboardResponse;
import com.farmafriend.erp.service.DashboardService;
import com.farmafriend.erp.utils.ApiResponse;
import com.farmafriend.erp.utils.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated statistics for admin, dealer, and representative executive dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> adminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard()));
    }

    @GetMapping("/dealer")
    @PreAuthorize("hasRole('DEALER')")
    public ResponseEntity<ApiResponse<DealerDashboardResponse>> dealerDashboard() {
        DealerDashboardResponse response = dashboardService.getDealerDashboard(SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/re")
    @PreAuthorize("hasRole('REPRESENTATIVE_EXECUTIVE')")
    public ResponseEntity<ApiResponse<RepresentativeDashboardResponse>> representativeDashboard() {
        RepresentativeDashboardResponse response = dashboardService
                .getRepresentativeDashboard(SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
