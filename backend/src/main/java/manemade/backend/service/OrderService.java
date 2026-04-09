package manemade.backend.service;

import manemade.backend.dto.OrderRequest;
import manemade.backend.dto.OrderResponse;
import manemade.backend.entity.*;
import manemade.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final PaymentService paymentService;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        AddressRepository addressRepository, PaymentRepository paymentRepository,
                        ItemRepository itemRepository, CartService cartService,
                        PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentRepository = paymentRepository;
        this.itemRepository = itemRepository;
        this.cartService = cartService;
        this.paymentService = paymentService;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (address.getIsDeleted() || address.getUser() == null || !address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Address does not belong to the selected user");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setStatus("PENDING");
        String paymentMode = normalizePaymentMode(request.getPaymentMode());
        order.setPaymentMode(paymentMode);

        double totalAmount = 0;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemReq.getItemId()));

            if (!item.getIsAvailable()) {
                throw new RuntimeException(item.getItemName() + " is currently unavailable");
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
        
        manemade.backend.dto.PaymentRequest paymentRequest = new manemade.backend.dto.PaymentRequest();
        paymentRequest.setUserId(user.getId());
        paymentRequest.setOrderId(savedOrder.getId());
        paymentRequest.setAmount(savedOrder.getTotalAmount());
        paymentRequest.setMethod(paymentMode);
        paymentRequest.setTransactionId(savedOrder.getTransactionId());
        
        manemade.backend.dto.PaymentResponse paymentResponse = paymentService.processPayment(paymentRequest);
        
        cartService.markCheckedOutIfMatches(
                user.getId(),
                request.getItems().stream().map(item -> {
                    manemade.backend.dto.CartItemRequest cartItem = new manemade.backend.dto.CartItemRequest();
                    cartItem.setItemId(item.getItemId());
                    cartItem.setQuantity(item.getQuantity());
                    return cartItem;
                }).collect(Collectors.toList())
        );

        return mapToResponse(savedOrder, paymentResponse);
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

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Order cannot be cancelled as it is already " + order.getStatus().toLowerCase());
        }

        order.setStatus("CANCELLED");
        return mapToResponse(orderRepository.save(order), null);
    }

    public OrderResponse mapToResponse(Order order, Object paymentObj) {
        manemade.backend.dto.PaymentResponse payment = null;
        if (paymentObj instanceof manemade.backend.dto.PaymentResponse) {
            payment = (manemade.backend.dto.PaymentResponse) paymentObj;
        } else if (paymentObj instanceof Payment) {
            payment = paymentService.mapToResponse((Payment) paymentObj);
        } else {
             payment = paymentRepository.findByOrderId(order.getId())
                .map(paymentService::mapToResponse)
                .orElse(null);
        }
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .addressId(order.getAddress().getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMode(order.getPaymentMode())
                .paymentStatus(payment != null ? payment.getStatus() : null)
                .paymentId(payment != null ? payment.getId() : null)
                .transactionId(order.getTransactionId())
                .userName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .userMobile(order.getUser().getMobileNumber())
                .deliveryAddress(formatAddress(order.getAddress()))
                .createdTs(order.getCreatedTs())
                .items(order.getItems().stream().map(this::mapToOrderItemResponse).collect(Collectors.toList()))
                .build();
    }

    private String formatAddress(Address address) {
        if (address == null) return "N/A";
        StringBuilder sb = new StringBuilder();
        if (address.getRecipientName() != null) sb.append(address.getRecipientName()).append(", ");
        sb.append(address.getLine1());
        if (address.getLine2() != null && !address.getLine2().isBlank()) sb.append(", ").append(address.getLine2());
        sb.append(", ").append(address.getCity()).append(", ").append(address.getState()).append(" - ").append(address.getPincode());
        return sb.toString();
    }

    public OrderResponse.OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(item.getItem().getId())
                .itemName(item.getItem().getItemName())
                .attributeQuantity("Regular") // Default since not yet in DB
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
