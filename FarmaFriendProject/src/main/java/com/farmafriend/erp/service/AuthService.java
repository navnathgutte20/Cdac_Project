package com.farmafriend.erp.service;

import com.farmafriend.erp.dto.request.LoginRequest;
import com.farmafriend.erp.dto.request.RefreshTokenRequest;
import com.farmafriend.erp.dto.request.RegisterRequest;
import com.farmafriend.erp.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
    JwtResponse refreshToken(RefreshTokenRequest request);
}
