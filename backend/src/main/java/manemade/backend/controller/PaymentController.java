package manemade.backend.controller;

import manemade.backend.dto.PaymentResponse;
import manemade.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrder(orderId));
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody manemade.backend.dto.PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }
}
