package com.farmafriend.erp.service;

import com.farmafriend.erp.dto.response.AdminDashboardResponse;
import com.farmafriend.erp.dto.response.DealerDashboardResponse;
import com.farmafriend.erp.dto.response.RepresentativeDashboardResponse;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();

    DealerDashboardResponse getDealerDashboard(Long dealerId);

    RepresentativeDashboardResponse getRepresentativeDashboard(Long representativeId);
}
