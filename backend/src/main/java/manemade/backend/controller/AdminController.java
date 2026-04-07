package manemade.backend.controller;

import manemade.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/trends")
    public ResponseEntity<List<Map<String, Object>>> getRevenueTrends() {
        return ResponseEntity.ok(adminService.getRevenueTrends());
    }

    @GetMapping("/top-items")
    public ResponseEntity<List<Map<String, Object>>> getTopItems() {
        return ResponseEntity.ok(adminService.getTopItems());
    }

    @GetMapping("/users")
    public ResponseEntity<List<manemade.backend.dto.UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> softDeleteUser(@PathVariable Long id) {
        adminService.softDeleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleMap) {
        adminService.updateUserRole(id, roleMap.get("role"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<manemade.backend.dto.OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        adminService.updateOrderStatus(id, statusMap.get("status"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSetting(@RequestBody Map<String, String> settingMap) {
        adminService.setSystemConfig(settingMap.get("key"), settingMap.get("value"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/payments")
    public ResponseEntity<List<manemade.backend.entity.Payment>> getAllPayments() {
        return ResponseEntity.ok(adminService.getAllPayments());
    }
}
