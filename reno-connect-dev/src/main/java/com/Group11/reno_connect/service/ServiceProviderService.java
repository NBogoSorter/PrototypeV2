package com.Group11.reno_connect.service;

import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.repository.ServiceProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceProviderService {

    private final ServiceProviderRepository serviceProviderRepository;

    public ServiceProviderService(ServiceProviderRepository serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }

    public List<ServiceProvider> getAllServiceProviders() {
        return serviceProviderRepository.findAll();
    }

    public Optional<ServiceProvider> getServiceProviderById(Long id) {
        return serviceProviderRepository.findById(id);
    }

    public ServiceProvider findByEmail(String email) {
        return serviceProviderRepository.findByEmail(email);
    }

    public ServiceProvider createServiceProvider(ServiceProvider serviceProvider) {
        return serviceProviderRepository.save(serviceProvider);
    }

    public ServiceProvider updateServiceProvider(Long id, ServiceProvider serviceProviderDetails) {
        ServiceProvider serviceProvider = serviceProviderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceProvider not found with id: " + id));

        serviceProvider.setBusinessName(serviceProviderDetails.getBusinessName());
        serviceProvider.setEmail(serviceProviderDetails.getEmail());
        // serviceProvider.setPassword(serviceProviderDetails.getPassword()); // DO NOT UPDATE PASSWORD LIKE THIS HERE
        
        // Only update password if a new, non-empty password is provided.
        // This assumes your serviceProviderDetails DTO might carry a new password to be set.
        // If profile updates should NEVER change passwords, this whole block can be removed.
        // If password changes are handled by a separate mechanism, that's even better.
        if (serviceProviderDetails.getPassword() != null && !serviceProviderDetails.getPassword().isEmpty()) {
            // IMPORTANT: The new password from serviceProviderDetails should be a PLAIN TEXT password
            // that needs to be ENCODED here before saving. You need to inject your PasswordEncoder.
            // For example:
            // serviceProvider.setPassword(passwordEncoder.encode(serviceProviderDetails.getPassword()));
            // For now, if this is not a password change form, it's best to not touch the password.
            // The current frontend form does not submit a password, so serviceProviderDetails.getPassword() will be null.
            // Thus, this block will correctly NOT update the password if it's null.
            // If serviceProviderDetails.getPassword() by chance contains an already hashed password from somewhere,
            // then this logic would need to be even more careful. But from a typical form, it would be plain text or null.
             System.out.println("Warning: Password update attempted through generic profile update. Ensure this is intended and new password is plain text to be encoded.");
             // serviceProvider.setPassword(passwordEncoder.encode(serviceProviderDetails.getPassword())); // Replace with actual encoding
        }

        serviceProvider.setAddress(serviceProviderDetails.getAddress());
        serviceProvider.setPhoneNumber(serviceProviderDetails.getPhoneNumber());

        // Add other fields like bio, availability if they exist on your ServiceProvider model
        // if (serviceProviderDetails.getBio() != null) { serviceProvider.setBio(serviceProviderDetails.getBio()); }
        // if (serviceProviderDetails.getAvailability() != null) { serviceProvider.setAvailability(serviceProviderDetails.getAvailability()); }

        return serviceProviderRepository.save(serviceProvider);
    }

    public void deleteServiceProvider(Long id) {
        ServiceProvider serviceProvider = serviceProviderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceProvider not found with id: " + id));
        serviceProviderRepository.delete(serviceProvider);
    }
} 