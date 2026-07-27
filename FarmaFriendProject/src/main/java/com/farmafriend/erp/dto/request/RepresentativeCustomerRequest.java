package com.farmafriend.erp.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Payload a REPRESENTATIVE_EXECUTIVE uses to onboard a new customer directly
 * in the field. The new user is always created with role CUSTOMER and is
 * automatically assigned to the onboarding representative.
 */
@Data
public class RepresentativeCustomerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    private String address;
}
