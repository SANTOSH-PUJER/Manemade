package manemade.backend.service;

import manemade.backend.dto.AddressRequest;
import manemade.backend.dto.AddressResponse;
import manemade.backend.entity.Address;
import manemade.backend.entity.User;
import manemade.backend.repository.AddressRepository;
import manemade.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AddressResponse saveAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address;
        if (request.getId() != null) {
            address = addressRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            if (address.getUser() == null || !address.getUser().getId().equals(userId)) {
                throw new RuntimeException("Address does not belong to the selected user");
            }
        } else {
            address = new Address();
            address.setUser(user);
        }

        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setRecipientName(request.getRecipientName());
        address.setRecipientPhone(request.getRecipientPhone());
        address.setAddressType(request.getAddressType());

        boolean shouldBeDefault = request.isDefault() || addressRepository.findByUserIdAndIsDeletedFalse(userId).isEmpty();
        if (shouldBeDefault) {
            resetDefaultAddresses(userId);
            address.setDefault(true);
        }

        Address savedAddress = addressRepository.save(address);
        return mapToResponse(savedAddress);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        request.setId(addressId);
        return saveAddress(userId, request);
    }

    @Override
    public List<AddressResponse> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserIdAndIsDeletedFalse(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        address.setDeleted(true);
        address.setDefault(false);
        addressRepository.save(address);
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        resetDefaultAddresses(userId);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        if (address.getUser() == null || !address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to the selected user");
        }
        address.setDefault(true);
        return mapToResponse(addressRepository.save(address));
    }

    private void resetDefaultAddresses(Long userId) {
        addressRepository.clearDefaultAddresses(userId);
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setLine1(address.getLine1());
        response.setLine2(address.getLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPincode(address.getPincode());
        response.setDefault(address.isDefault());
        response.setRecipientName(address.getRecipientName());
        response.setRecipientPhone(address.getRecipientPhone());
        response.setAddressType(address.getAddressType());
        return response;
    }
}
