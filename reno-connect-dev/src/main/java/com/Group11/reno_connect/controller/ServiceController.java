package com.Group11.reno_connect.controller;

import java.util.List;

import com.Group11.reno_connect.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.repository.ServiceProviderRepository;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.dto.ServiceSearchDTO;
import com.Group11.reno_connect.dto.ServiceDetailDTO;
import com.Group11.reno_connect.repository.ServiceRepository;
import jakarta.validation.Valid;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {
    private static final Logger logger = LoggerFactory.getLogger(ServiceController.class);

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id, Authentication authentication) {
        logger.debug("Attempting to fetch service details for ID: {} for user: {}", id, authentication.getName());
        Optional<ServiceDetailDTO> serviceDetailOptional = serviceRepository.findServiceDetailById(id);
        if (serviceDetailOptional.isPresent()) {
            logger.debug("Service details found for ID: {}", id);
            return ResponseEntity.ok(serviceDetailOptional.get());
        } else {
            logger.warn("Service details not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ServiceSearchDTO>> getAllServices() {
        logger.debug("Getting all services for search using ServiceService");
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ServiceSearchDTO>> searchServices(@RequestParam(required = false) String query) {
        logger.debug("Searching services with query: {}", query);
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(serviceService.getAllServices());
        }
        List<ServiceSearchDTO> allServices = serviceService.getAllServices();
        if (query != null && !query.trim().isEmpty()) {
            String lowerCaseQuery = query.trim().toLowerCase();
            List<ServiceSearchDTO> filteredServices = allServices.stream()
                .filter(s -> (s.getName() != null && s.getName().toLowerCase().contains(lowerCaseQuery)) ||
                              (s.getDescription() != null && s.getDescription().toLowerCase().contains(lowerCaseQuery)) ||
                              (s.getType() != null && s.getType().toLowerCase().contains(lowerCaseQuery)) ||
                              (s.getProviderName() != null && s.getProviderName().toLowerCase().contains(lowerCaseQuery)))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(filteredServices);
        }
        return ResponseEntity.ok(allServices);
    }

    @GetMapping("/provider")
    public ResponseEntity<List<ServiceSearchDTO>> getProviderServices(Authentication authentication) {
        logger.debug("Getting services for provider: {}", authentication.getName());
        
        ServiceProvider provider = serviceProviderRepository.findByEmail(authentication.getName());
        if (provider == null) {
            logger.error("Service provider not found for email: {}", authentication.getName());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        List<ServiceSearchDTO> servicesDTO = serviceService.getServicesByProviderAsDTO(provider.getId());
        logger.debug("Found {} services (as DTOs) for provider ID: {}", servicesDTO.size(), provider.getId());
        
        return ResponseEntity.ok(servicesDTO);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceModel> createService(@Valid @RequestBody ServiceModel service, Authentication authentication) {
        logger.debug("Creating service for user: {}", authentication.getName());
        
        ServiceProvider provider = serviceProviderRepository.findByEmail(authentication.getName());
        if (provider == null) {
            logger.error("Service provider not found for email: {}", authentication.getName());
            return ResponseEntity.badRequest().build();
        }
        
        service.setServiceProvider(provider);
        
        ServiceModel savedService = serviceRepository.save(service);
        logger.debug("Created service with ID: {}", savedService.getId());
        
        return ResponseEntity.ok(savedService);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> deleteService(@PathVariable Long id, Authentication authentication) {
        String providerEmail = authentication.getName();
        logger.debug("Attempting to delete service with ID: {} for provider: {}", id, providerEmail);

        ServiceProvider currentProvider = serviceProviderRepository.findByEmail(providerEmail);
        if (currentProvider == null) {
            logger.warn("Provider not found for email: {} during delete operation", providerEmail);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Provider not found.");
        }

        Optional<ServiceModel> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isEmpty()) {
            logger.warn("Service with ID: {} not found for deletion.", id);
            return ResponseEntity.notFound().build();
        }

        ServiceModel serviceToDelete = serviceOptional.get();

        if (serviceToDelete.getServiceProvider() == null || 
            !serviceToDelete.getServiceProvider().getId().equals(currentProvider.getId())) {
            logger.warn("Provider {} (ID: {}) does not own service with ID: {}. Actual owner ID: {}", 
                providerEmail, currentProvider.getId(), id, 
                serviceToDelete.getServiceProvider() != null ? serviceToDelete.getServiceProvider().getId() : "null");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to delete this service.");
        }

        try {
            serviceRepository.deleteById(id);
            logger.info("Successfully deleted service with ID: {} by provider: {}", id, providerEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting service with ID: {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete service due to an internal error.");
        }
    }

    @PutMapping("/{serviceId}/sponsor")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceSearchDTO> sponsorService(@PathVariable Long serviceId) {
        ServiceSearchDTO sponsoredService = serviceService.setSponsoredService(serviceId);
        return ResponseEntity.ok(sponsoredService);
    }

    @DeleteMapping("/{serviceId}/sponsor")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceSearchDTO> unsponsorService(@PathVariable Long serviceId) {
        ServiceSearchDTO unsponsoredService = serviceService.removeSponsoredService(serviceId);
        return ResponseEntity.ok(unsponsoredService);
    }

    @GetMapping("/debug/all")
    public ResponseEntity<?> debugAllServices(Authentication authentication) {
        logger.debug("Debug endpoint called by user: {}", authentication.getName());
        
        List<ServiceModel> allServices = serviceRepository.findAllServices();
        logger.debug("Total services in database: {}", allServices.size());
        
        ServiceProvider provider = serviceProviderRepository.findByEmail(authentication.getName());
        if (provider != null) {
            List<ServiceModel> providerServices = serviceRepository.findAllServicesByProviderId(provider.getId());
            logger.debug("Services for provider {} (ID: {}): {}", 
                provider.getEmail(), 
                provider.getId(), 
                providerServices.size());
            
            for (ServiceModel service : providerServices) {
                logger.debug("Provider service - ID: {}, Name: {}, Provider ID: {}", 
                    service.getId(), 
                    service.getName(),
                    service.getServiceProvider() != null ? service.getServiceProvider().getId() : "null");
            }
        }
        
        return ResponseEntity.ok(allServices);
    }
}