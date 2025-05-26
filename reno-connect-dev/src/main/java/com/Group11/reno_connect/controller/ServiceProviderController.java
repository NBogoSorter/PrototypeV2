package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.service.ServiceProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import com.Group11.reno_connect.model.Review;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/service-providers")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceProviderController {

    private final ServiceProviderService serviceProviderService;

    public ServiceProviderController(ServiceProviderService serviceProviderService) {
        this.serviceProviderService = serviceProviderService;
    }

    @GetMapping
    public List<ServiceProvider> getAllServiceProviders() {
        return serviceProviderService.getAllServiceProviders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceProvider> getServiceProviderById(@PathVariable Long id) {
        return serviceProviderService.getServiceProviderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<ServiceProvider> getCurrentServiceProvider(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        ServiceProvider serviceProvider = serviceProviderService.findByEmail(email);
        if (serviceProvider == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(serviceProvider);
    }

    @GetMapping("/{providerId}/reviews")
    public ResponseEntity<List<Review>> getProviderReviews(@PathVariable Long providerId) {
        Optional<ServiceProvider> providerOptional = serviceProviderService.getServiceProviderById(providerId);
        if (providerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ServiceProvider provider = providerOptional.get();
        List<Review> allReviews = provider.getServices().stream()
                                          .flatMap(service -> service.getReviews().stream())
                                          .collect(Collectors.toList());
        return ResponseEntity.ok(allReviews);
    }

    @PostMapping
    public ResponseEntity<ServiceProvider> createServiceProvider(@RequestBody ServiceProvider serviceProvider) {
        ServiceProvider createdServiceProvider = serviceProviderService.createServiceProvider(serviceProvider);
        return ResponseEntity.ok(createdServiceProvider);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProvider> updateServiceProvider(@PathVariable Long id, @RequestBody ServiceProvider serviceProviderDetails) {
        try {
            ServiceProvider updatedServiceProvider = serviceProviderService.updateServiceProvider(id, serviceProviderDetails);
            return ResponseEntity.ok(updatedServiceProvider);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceProvider(@PathVariable Long id) {
        try {
            serviceProviderService.deleteServiceProvider(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 