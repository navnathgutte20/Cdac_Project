package com.payment.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.payment.dto.request.CreateOrderRequest;
import com.payment.dto.request.VerifyPaymentRequest;
import com.payment.dto.response.CreateOrderResponse;
import com.payment.dto.response.PaymentStatusResponse;
import com.payment.entity.Payment;
import com.payment.entity.PaymentStatus;
import com.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Value("${razorpay.key}")
    private String razorpayKey;

    public CreateOrderResponse createOrder(CreateOrderRequest request)
            throws Exception {

        JSONObject json = new JSONObject();

        json.put("amount",
                request.getAmount().multiply(BigDecimal.valueOf(100)));

        json.put("currency", "INR");

        json.put("receipt",
                "receipt_" + request.getOrderId());

        Order razorOrder = razorpayClient.orders.create(json);

        Payment payment = new Payment();

        payment.setOrderId(request.getOrderId());

        payment.setAmount(request.getAmount());

        payment.setStatus(PaymentStatus.CREATED);

        payment.setRazorpayOrderId(razorOrder.get("id"));

        paymentRepository.save(payment);

        CreateOrderResponse response = new CreateOrderResponse();

        response.setAmount(razorOrder.get("amount"));

        response.setCurrency(razorOrder.get("currency"));

        response.setRazorpayOrderId(razorOrder.get("id"));

        response.setKey(razorpayKey);

        return response;
    }

    @Transactional
    public boolean verify(VerifyPaymentRequest request) {
        try {
            JSONObject json = new JSONObject();
            json.put("razorpay_order_id", request.getRazorpayOrderId());
            json.put("razorpay_payment_id", request.getRazorpayPaymentId());
            json.put("razorpay_signature", request.getRazorpaySignature());

            boolean verified = Utils.verifyPaymentSignature(json, razorpaySecret);
            System.out.println("verified ==> " + verified);

            Payment payment = paymentRepository
                    .findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow();

            if (verified) {
                payment.setStatus(payment.getStatus());
                payment.setPaymentDate(LocalDateTime.now());
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
            } else {
                payment.setStatus(PaymentStatus.FAILED);
            }
            paymentRepository.save(payment);
            return verified;
        } catch (Exception e) {
            e.printStackTrace(); // add this temporarily so it's not a silent swallow
            return false;
        }
    }
    
    public PaymentStatusResponse getPaymentStatus(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order " + orderId));

        System.out.println(payment.getStatus());
        PaymentStatusResponse response = new PaymentStatusResponse();
        response.setOrderId(payment.getOrderId());
        response.setStatus(payment.getStatus());
        response.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        return response;
    }
}