package manemade.backend.service;

import manemade.backend.entity.*;
import manemade.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final UserService userService;

    public AdminService(OrderRepository orderRepository, 
                        UserRepository userRepository, 
                        ItemRepository itemRepository,
                        SystemConfigRepository systemConfigRepository,
                        PaymentRepository paymentRepository,
                        OrderService orderService,
                        UserService userService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
        this.userService = userService;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total Base Stats
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalItems", itemRepository.count());
        
        List<Order> allOrders = orderRepository.findAll();
        double totalRevenue = allOrders.stream()
                .filter(o -> !o.getStatus().equals("CANCELLED"))
                .mapToDouble(Order::getTotalAmount)
                .sum();
        stats.put("totalRevenue", totalRevenue);

        // Today's Stats
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        List<Order> todayOrders = allOrders.stream()
                .filter(o -> o.getCreatedTs().isAfter(startOfDay))
                .collect(Collectors.toList());
        
        stats.put("todayOrders", todayOrders.size());
        stats.put("todayRevenue", todayOrders.stream()
                .filter(o -> !o.getStatus().equals("CANCELLED"))
                .mapToDouble(Order::getTotalAmount)
                .sum());

        // Platform Configs
        stats.put("shopStatus", getSystemConfig("SHOP_STATUS", "OPEN"));

        return stats;
    }

    public List<Map<String, Object>> getRevenueTrends() {
        List<Order> allOrders = orderRepository.findAll();
        Map<LocalDate, Double> dailyRevenue = allOrders.stream()
                .filter(o -> !o.getStatus().equals("CANCELLED"))
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedTs().toLocalDate(),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        return dailyRevenue.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .limit(30)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("date", e.getKey().toString());
                    m.put("revenue", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTopItems() {
        List<Order> allOrders = orderRepository.findAll();
        Map<String, Long> itemCounts = allOrders.stream()
                .filter(o -> !o.getStatus().equals("CANCELLED"))
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(
                        oi -> oi.getItem().getItemName(),
                        Collectors.counting()
                ));

        return itemCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("orders", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    public String getSystemConfig(String key, String defaultValue) {
        return systemConfigRepository.findByConfigKey(key)
                .map(SystemConfig::getConfigValue)
                .orElse(defaultValue);
    }

    @Transactional
    public void setSystemConfig(String key, String value) {
        SystemConfig config = systemConfigRepository.findByConfigKey(key)
                .orElse(new SystemConfig(key, value));
        config.setConfigValue(value);
        systemConfigRepository.save(config);
    }

    public java.util.List<manemade.backend.dto.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void softDeleteUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsDeleted(true);
            userRepository.save(user);
        });
    }

    @Transactional
    public void updateUserRole(Long id, String role) {
        userRepository.findById(id).ifPresent(user -> {
            user.setRole(role);
            userRepository.save(user);
        });
    }

    public java.util.List<manemade.backend.dto.OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> o2.getCreatedTs().compareTo(o1.getCreatedTs()))
                .map(order -> orderService.mapToResponse(order, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateOrderStatus(Long id, String status) {
        orderRepository.findById(id).ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
        });
    }

    public List<manemade.backend.entity.Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedTsDesc();
    }
}
