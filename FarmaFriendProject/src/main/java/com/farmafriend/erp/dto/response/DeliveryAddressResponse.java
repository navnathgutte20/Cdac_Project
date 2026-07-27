package com.farmafriend.erp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryAddressResponse {

    private Long addressId;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
}