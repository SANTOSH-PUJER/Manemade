package manemade.backend.service;

import manemade.backend.dto.OrderRequest;
import manemade.backend.dto.OrderResponse;
import manemade.backend.entity.*;
import manemade.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ItemRepository itemRepository;
    private final PaymentRepository paymentRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        AddressRepository addressRepository, ItemRepository itemRepository,
                        PaymentRepository paymentRepository, CartService cartService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.itemRepository = itemRepository;
        this.paymentRepository = paymentRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (address.isDeleted() || address.getUser() == null || !address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Address does not belong to the selected user");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setStatus("PLACED");
        String paymentMode = normalizePaymentMode(request.getPaymentMode());
        order.setPaymentMode(paymentMode);

        double totalAmount = 0;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemReq.getItemId()));

            if (!item.isAvailable()) {
                throw new RuntimeException(item.getName() + " is currently unavailable");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setItem(item);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(item.getPrice());

            order.addOrderItem(orderItem);
            totalAmount += item.getPrice() * itemReq.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        order.setTransactionId(buildTransactionId(paymentMode));
        Order savedOrder = orderRepository.save(order);
        Payment payment = createPaymentRecord(user, savedOrder, paymentMode);
        cartService.markCheckedOutIfMatches(
                user.getId(),
                request.getItems().stream().map(item -> {
                    manemade.backend.dto.CartItemRequest cartItem = new manemade.backend.dto.CartItemRequest();
                    cartItem.setItemId(item.getItemId());
                    cartItem.setQuantity(item.getQuantity());
                    return cartItem;
                }).collect(Collectors.toList())
        );

        return mapToResponse(savedOrder, payment);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserOrderByCreatedTsDesc(user).stream()
                .map(order -> mapToResponse(order, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> o2.getCreatedTs().compareTo(o1.getCreatedTs()))
                .map(order -> mapToResponse(order, null))
                .collect(Collectors.toList());
    }

    private Payment createPaymentRecord(User user, Order order, String paymentMode) {
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setOrder(order);
        payment.setMethod(paymentMode);
        payment.setAmount(order.getTotalAmount());
        payment.setTransactionId(order.getTransactionId());
        payment.setStatus("cod".equals(paymentMode) ? "PENDING" : "SUCCESS");
        payment.setPaidAt("cod".equals(paymentMode) ? null : LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    private OrderResponse mapToResponse(Order order, Payment payment) {
        Payment resolvedPayment = payment != null ? payment : paymentRepository.findByOrderId(order.getId()).orElse(null);
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .addressId(order.getAddress().getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMode(order.getPaymentMode())
                .paymentStatus(resolvedPayment != null ? resolvedPayment.getStatus() : null)
                .paymentId(resolvedPayment != null ? resolvedPayment.getId() : null)
                .transactionId(order.getTransactionId())
                .createdTs(order.getCreatedTs())
                .items(order.getItems().stream().map(this::mapToOrderItemResponse).collect(Collectors.toList()))
                .build();
    }

    private OrderResponse.OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(item.getItem().getId())
                .itemName(item.getItem().getName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }

    private String normalizePaymentMode(String paymentMode) {
        if (paymentMode == null || paymentMode.isBlank()) {
            return "upi";
        }
        return paymentMode.trim().toLowerCase(Locale.ROOT);
    }

    private String buildTransactionId(String paymentMode) {
        String prefix = "cod".equals(paymentMode) ? "COD" : "PAY";
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }
}
