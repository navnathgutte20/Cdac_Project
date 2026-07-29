import { orderService } from '../services/orderService'

/**
 * A small, fully self-contained rule-based assistant — no external AI service
 * involved. It pattern-matches the message and, where useful, calls the same
 * backend endpoints the customer's own pages use (so answers about "my
 * orders" or "track order 123" are always real, live data, not canned text).
 */
export async function generateBotReply(message, { user, cartItems = [], cartTotal = 0 } = {}) {
  const text = message.toLowerCase().trim()
  const firstName = user?.name?.split(' ')[0]

  if (/^(hi|hello|hey|hii+|yo|good (morning|afternoon|evening))\b/.test(text)) {
    return `Hello${firstName ? ' ' + firstName : ''}! 👋 I can help you track an order, check your cart, or answer questions about delivery, payments, and returns. What do you need?`
  }

  if (/thank/.test(text)) {
    return "You're welcome! Let me know if there's anything else I can help with. 🌱"
  }

  if (/^(bye|goodbye|see ya)\b/.test(text)) {
    return 'Goodbye! Have a great day. 🌱'
  }

  if (/track|order status|status of my order/.test(text)) {
    const idMatch = text.match(/\d{1,10}/)
    if (idMatch) {
      const orderId = idMatch[0]
      try {
        const res = await orderService.getOrder(orderId)
        const o = res.data.data ?? res.data
        return `Order #${o.orderId} is currently **${o.status}**. Placed on ${new Date(o.orderDate).toLocaleDateString()}. Total: ₹${o.totalAmount}.`
      } catch {
        return `I couldn't find order #${orderId} on your account. Double-check the order number on your Orders page.`
      }
    }
    return 'Sure — what\'s the order number? Try something like "track order 123".'
  }

  if (/my orders|recent orders|order history|list.*orders/.test(text)) {
    try {
      const res = await orderService.myOrders({ page: 0, size: 5 })
      const orders = res.data.data.content
      if (orders.length === 0) return "You haven't placed any orders yet. Head over to Products to get started!"
      return `Here are your most recent orders:\n${orders.map((o) => `#${o.orderId} — ${o.status} — ₹${o.totalAmount}`).join('\n')}`
    } catch {
      return "I couldn't load your orders right now — please check the Orders page directly."
    }
  }

  if (/\bcart\b/.test(text)) {
    if (cartItems.length === 0) return 'Your cart is empty right now. Browse Products to add something!'
    return `You have ${cartItems.length} item(s) in your cart worth ₹${cartTotal} in total. Head to your Cart to select items and check out.`
  }

  if (/deliver|shipping|when will.*arrive/.test(text)) {
    return 'Most orders are dispatched within 1–2 business days of being claimed by a dealer, and delivered within 3–7 business days depending on your location. You can check live status any time on the Orders page.'
  }

  if (/return|refund|cancel/.test(text)) {
    return "You can cancel an order from the Orders page as long as it hasn't been dispatched yet. For returns after delivery, please contact our support team with your order number."
  }

  if (/payment|\bpay\b|upi|card|cod/.test(text)) {
    return 'We support UPI, Net Banking, Credit/Debit Cards, and Cash on Delivery. You can choose your preferred method during checkout.'
  }

  if (/contact|support|human|agent|representative/.test(text)) {
    return "You can reach our support team at support@farmafriend.com. I'm also here for quick questions about orders, your cart, delivery, and payments!"
  }

  if (/help|what can you do/.test(text)) {
    return 'I can help with:\n• Tracking an order — try "track order 123"\n• "my orders"\n• "what\'s in my cart"\n• Delivery, payment, or return questions\n• "contact support"'
  }

  return "I'm not sure I understood that. I can help with:\n• Tracking an order — try \"track order 123\"\n• \"my orders\"\n• \"what's in my cart\"\n• Delivery, payment, or return questions\n• \"contact support\""
}
