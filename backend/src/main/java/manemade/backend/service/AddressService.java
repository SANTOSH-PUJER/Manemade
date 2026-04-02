package manemade.backend.service;

import manemade.backend.dto.AddressRequest;
import manemade.backend.dto.AddressResponse;
import java.util.List;

public interface AddressService {
    AddressResponse saveAddress(Long userId, AddressRequest request);
    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);
    List<AddressResponse> getAddressesByUserId(Long userId);
    void deleteAddress(Long addressId);
    AddressResponse setDefaultAddress(Long userId, Long addressId);
}
