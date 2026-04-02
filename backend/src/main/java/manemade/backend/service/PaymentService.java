package manemade.backend.service;

import manemade.backend.dto.PaymentResponse;
import manemade.backend.entity.Order;
import manemade.backend.entity.Payment;
import manemade.backend.entity.User;
import manemade.backend.repository.OrderRepository;
import manemade.backend.repository.PaymentRepository;
import manemade.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<PaymentResponse> getPaymentsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return paymentRepository.findByUserIdOrderByCreatedTsDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentByOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));
        return mapToResponse(payment);
    }

    public PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder().getId());
        response.setUserId(payment.getUser().getId());
        response.setMethod(payment.getMethod());
        response.setStatus(payment.getStatus());
        response.setAmount(payment.getAmount());
        response.setTransactionId(payment.getTransactionId());
        response.setPaidAt(payment.getPaidAt());
        response.setCreatedTs(payment.getCreatedTs());
        return response;
    }
}
