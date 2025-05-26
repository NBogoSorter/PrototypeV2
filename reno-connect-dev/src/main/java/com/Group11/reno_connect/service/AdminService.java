package com.Group11.reno_connect.service;

import com.Group11.reno_connect.dto.UserViewDTO;
import com.Group11.reno_connect.dto.UserUpdateDTO;
import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.model.User;
import com.Group11.reno_connect.model.Admin;
//import com.Group11.reno_connect.repository.HomeOwnerRepository;
//import com.Group11.reno_connect.repository.ServiceProviderRepository;
import com.Group11.reno_connect.repository.UserRepository;
import com.Group11.reno_connect.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    //@Autowired
    //private HomeOwnerRepository homeOwnerRepository;

    //@Autowired
    //private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private UserRepository userRepository; // To delete users from the base user_account table

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserViewDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserViewDTO createAdmin(Admin admin) {
        // Check if email already exists
        if (userRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        // Encode password
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        // Save admin
        Admin savedAdmin = userRepository.save(admin);
        return convertToDTO(savedAdmin);
    }

    public List<UserViewDTO> filterUsers(String userType, String email) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> {
                    if (userType == null || userType.equals("ALL")) {
                        return true;
                    }
                    if (userType.equals("HOMEOWNER")) {
                        return user instanceof HomeOwner;
                    }
                    if (userType.equals("PROVIDER")) {
                        return user instanceof ServiceProvider;
                    }
                    return false;
                })
                .filter(user -> email == null || user.getEmail().toLowerCase().contains(email.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId));

        // Add more sophisticated deletion logic if needed (e.g., handling related bookings, reviews)
        // For now, we'll just delete the user record.

        // Spring Data JPA with @Inheritance(strategy = InheritanceType.JOINED)
        // should handle deleting from the specific subtype table (home_owner or service_provider)
        // and then from the parent user_account table when userRepository.delete(user) is called.
        userRepository.delete(user);
    }

    @Transactional
    public UserViewDTO updateUser(Long userId, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId));

        // Update common fields
        user.setEmail(userUpdateDTO.getEmail());

        if (user instanceof HomeOwner) {
            HomeOwner homeOwner = (HomeOwner) user;
            homeOwner.setFirstName(userUpdateDTO.getFirstName());
            homeOwner.setLastName(userUpdateDTO.getLastName());
            homeOwner.setPhoneNumber(userUpdateDTO.getPhoneNumber());
            homeOwner.setAddress(userUpdateDTO.getAddress());
            userRepository.save(homeOwner);
        } else if (user instanceof ServiceProvider) {
            ServiceProvider provider = (ServiceProvider) user;
            provider.setBusinessName(userUpdateDTO.getBusinessName());
            provider.setPhoneNumber(userUpdateDTO.getPhoneNumber());
            provider.setAddress(userUpdateDTO.getAddress());
            userRepository.save(provider);
        }

        return convertToDTO(user);
    }

    private UserViewDTO convertToDTO(User user) {
        Double averageRating = null;
        String userType;
        String firstName = null;
        String lastName = null;
        String businessName = null;
        String phoneNumber = null;
        String address = null;

        if (user instanceof HomeOwner) {
            HomeOwner homeOwner = (HomeOwner) user;
            userType = "HOMEOWNER";
            firstName = homeOwner.getFirstName();
            lastName = homeOwner.getLastName();
            phoneNumber = homeOwner.getPhoneNumber();
            address = homeOwner.getAddress();
        } else if (user instanceof ServiceProvider) {
            ServiceProvider provider = (ServiceProvider) user;
            userType = "PROVIDER";
            businessName = provider.getBusinessName();
            phoneNumber = provider.getPhoneNumber();
            address = provider.getAddress();
            averageRating = reviewRepository.findAverageRatingByProviderId(user.getId())
                    .orElse(0.0);
        } else if (user instanceof Admin) {
            userType = "ADMIN";
            firstName = "Admin";
            lastName = "User";
            phoneNumber = "N/A";
            address = "N/A";
        } else {
            userType = "UNKNOWN";
        }

        return new UserViewDTO(
            user.getId(),
            user.getEmail(),
            userType,
            firstName,
            lastName,
            businessName,
            phoneNumber,
            address,
            averageRating
        );
    }

    // Add methods for updateUser, getUserById, filtering, etc. later
} 