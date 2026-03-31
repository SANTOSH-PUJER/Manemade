package manemade.backend.controller;

import manemade.backend.dto.AddressRequest;
import manemade.backend.dto.AddressResponse;
import manemade.backend.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressResponse> saveAddress(@PathVariable Long userId, @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.saveAddress(userId, request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponse>> getAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{addressId}/set-default/user/{userId}")
    public ResponseEntity<AddressResponse> setDefaultAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.setDefaultAddress(userId, addressId));
    }
}
