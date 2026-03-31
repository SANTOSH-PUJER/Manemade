package manemade.backend.service;

import manemade.backend.repository.*;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public AdminService(OrderRepository orderRepository, UserRepository userRepository, ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalItems", itemRepository.count());
        
        Double totalRevenue = orderRepository.findAll().stream()
                .mapToDouble(order -> order.getTotalAmount())
                .sum();
        stats.put("totalRevenue", totalRevenue);
        
        return stats;
    }
}
