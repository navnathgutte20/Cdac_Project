package com.farmafriend.erp.service.impl;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.farmafriend.erp.entity.Order;
import com.farmafriend.erp.entity.OrderItem;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.service.EmailService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final JavaMailSender mailSender;

    @Value("${app.name}")
    private String appName;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    @Async("emailTaskExecutor")
    public void sendRegistrationSuccessEmail(User user) {
        String body = """
                <p>Hi %s,</p>
                <p>Your %s account has been created successfully. You're all set to start exploring
                agri-inputs, tracking orders, and managing your account.</p>
                <p style="margin-top:24px;">
                  <a href="%s/login" style="background:#0B6E4F;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
                    Go to your dashboard
                  </a>
                </p>
                """.formatted(escape(user.getName()), appName, frontendUrl);

        send("nagutte0@gmail.com", "Welcome to " + appName + "!", wrapTemplate("Welcome aboard 🌱", body));
    }

    @Override
    @Async("emailTaskExecutor")
    public void sendPasswordResetEmail(User user, String rawToken) {
        String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;
        String body = """
                <p>Hi %s,</p>
                <p>We received a request to reset your %s password. Click the button below to choose a
                new one. This link expires in 30 minutes.</p>
                <p style="margin-top:24px;">
                  <a href="%s" style="background:#0B6E4F;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
                    Reset your password
                  </a>
                </p>
                <p style="margin-top:24px;color:#8A8A80;font-size:13px;">
                  If you didn't request this, you can safely ignore this email — your password won't change.
                </p>
                """.formatted(escape(user.getName()), appName, resetUrl);

        send("nagutte0@gmail.com", "Reset your " + appName + " password", wrapTemplate("Password reset request", body));
    }

    @Override
    @Async("emailTaskExecutor")
    public void sendOrderSuccessEmail(Order order) {
        User customer = order.getCustomer();
        String body = """
                <p>Hi %s,</p>
                <p>Thanks for your order! Here's a quick summary:</p>
                <p><strong>Order #%d</strong> &middot; placed %s</p>
                %s
                <p style="margin-top:16px;font-size:16px;"><strong>Total: %s</strong></p>
                %s
                """.formatted(
                escape(customer.getName()),
                order.getOrderId(),
                order.getOrderDate() != null ? order.getOrderDate().format(DATE_FORMAT) : "",
                buildItemsTable(order),
                formatAmount(order.getTotalAmount()),
                buildAddressBlock(order));

        send("nagutte0@gmail.com", "Order #" + order.getOrderId() + " confirmed",
                wrapTemplate("Order confirmed ✅", body));
    }

    @Override
    @Async("emailTaskExecutor")
    public void sendShipmentEmail(Order order) {
        User customer = order.getCustomer();
        String tracking = order.getTrackingNumber() != null ? order.getTrackingNumber() : "—";
        String body = """
                <p>Hi %s,</p>
                <p>Good news — your order <strong>#%d</strong> is on its way!</p>
                <p><strong>Tracking number:</strong> %s</p>
                <p><strong>Dispatched:</strong> %s</p>
                %s
                """.formatted(
                escape(customer.getName()),
                order.getOrderId(),
                escape(tracking),
                order.getShipmentDate() != null ? order.getShipmentDate().format(DATE_FORMAT) : "",
                buildAddressBlock(order));

        send("nagutte0@gmail.com", "Order #" + order.getOrderId() + " has been dispatched",
                wrapTemplate("Your order is on its way 🚚", body));
    }

    @Override
    @Async("emailTaskExecutor")
    public void sendDeliveryEmail(Order order) {
        User customer = order.getCustomer();
        String body = """
                <p>Hi %s,</p>
                <p>Your order <strong>#%d</strong> has been delivered. We hope everything arrived in great
                shape!</p>
                <p>If anything looks off, reach out to our support team and we'll sort it out.</p>
                """.formatted(escape(customer.getName()), order.getOrderId());

        send("nagutte0@gmail.com", "Order #" + order.getOrderId() + " delivered",
                wrapTemplate("Delivered! 📦", body));
    }

    // ---- internals ----

    private void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(to);
            helper.setFrom(fromAddress);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception e) {
            // Email delivery must never break the calling business flow
            // (registration, checkout, shipment updates), so we only log.
            log.error("Failed to send email to {} with subject '{}': {}", to, subject, e.getMessage());
        }
    }

    private String wrapTemplate(String heading, String bodyHtml) {
        return """
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E4E1D8;border-radius:8px;overflow:hidden;">
                  <div style="background:#0B6E4F;padding:20px 24px;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;">%s</span>
                  </div>
                  <div style="padding:24px;background:#ffffff;color:#2A2A2A;line-height:1.5;">
                    <h2 style="margin-top:0;color:#0B6E4F;">%s</h2>
                    %s
                  </div>
                  <div style="padding:16px 24px;background:#F7F5F0;color:#8A8A80;font-size:12px;">
                    This is an automated message from %s. Please do not reply to this email.
                  </div>
                </div>
                """.formatted(appName, heading, bodyHtml, appName);
    }

    private String buildItemsTable(Order order) {
        StringBuilder rows = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            rows.append("""
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #EEEEE6;">%s</td>
                      <td style="padding:8px 0;border-bottom:1px solid #EEEEE6;text-align:center;">x%d</td>
                      <td style="padding:8px 0;border-bottom:1px solid #EEEEE6;text-align:right;">%s</td>
                    </tr>
                    """.formatted(
                    escape(item.getProduct() != null ? item.getProduct().getProductName() : "Product"),
                    item.getQuantity(),
                    formatAmount(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))));
        }
        return """
                <table style="width:100%%;border-collapse:collapse;margin-top:12px;">
                  <thead>
                    <tr>
                      <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #0B6E4F;">Product</th>
                      <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #0B6E4F;">Qty</th>
                      <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #0B6E4F;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    %s
                  </tbody>
                </table>
                """.formatted(rows);
    }

    private String buildAddressBlock(Order order) {
        if (order.getDeliveryAddress() == null) {
            return "";
        }
        var address = order.getDeliveryAddress();
        return """
                <p style="margin-top:16px;color:#5A5A50;">
                  <strong>Delivering to:</strong><br/>
                  %s, %s, %s - %s
                </p>
                """.formatted(
                escape(address.getAddressLine()), escape(address.getCity()),
                escape(address.getState()), escape(address.getPincode()));
    }

    private String formatAmount(BigDecimal amount) {
        return "₹" + (amount != null ? amount.toPlainString() : "0");
    }

    /** Minimal HTML-escaping since this content is interpolated straight into an email body */
    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
