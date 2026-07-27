package com.farmafriend.erp.dto.response;

import com.farmafriend.erp.constants.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Generic profile response used for Customers, Dealers, and Representative Executives
 * — all of which now live in the single `users` table.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private RoleName role;
    private String address;
    private String location;
    private String representativeName;
    private LocalDateTime createdAt;
}
