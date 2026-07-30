package com.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.payment.dto.request.CreateOrderRequest;
import com.payment.dto.request.VerifyPaymentRequest;
import com.payment.dto.response.CreateOrderResponse;
import com.payment.dto.response.PaymentStatusResponse;
import com.payment.entity.PaymentStatus;
import com.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(
            @RequestBody CreateOrderRequest request)
            throws Exception {

        return ResponseEntity.ok(
                paymentService.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(
            @RequestBody VerifyPaymentRequest request) {

        boolean verified =
                paymentService.verify(request);

        if (verified) {

            return ResponseEntity.ok("Payment Successful");

        }

        return ResponseEntity.badRequest()
                .body("Payment Failed");

    }
    @GetMapping("/status/{orderId}")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(orderId));
    }

}