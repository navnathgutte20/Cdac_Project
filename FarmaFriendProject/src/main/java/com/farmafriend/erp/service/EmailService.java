package com.farmafriend.erp.service;

import com.farmafriend.erp.entity.Order;
import com.farmafriend.erp.entity.User;

/**
 * All emails are sent asynchronously and failures are logged rather than
 * propagated, so a mail server outage never blocks registration, checkout,
 * or shipment updates.
 */
public interface EmailService {

    void sendRegistrationSuccessEmail(User user);

    void sendPasswordResetEmail(User user, String rawToken);

    void sendOrderSuccessEmail(Order order);

    void sendShipmentEmail(Order order);

    void sendDeliveryEmail(Order order);
}
