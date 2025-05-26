package com.Group11.reno_connect.service;

import com.Group11.reno_connect.dto.ServiceSearchDTO;
import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.model.User;
//import com.Group11.reno_connect.repository.ServiceProviderRepository;
import com.Group11.reno_connect.repository.UserRepository;
import com.Group11.reno_connect.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    //@Autowired
    //private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private UserRepository userRepository;

    private ServiceProvider getCurrentServiceProvider() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User user = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        if (!(user instanceof ServiceProvider)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a service provider");
        }
        return (ServiceProvider) user;
    }

    public List<ServiceSearchDTO> getAllServices() {
        return serviceRepository.findAllServicesForSearch();
    }

    public List<ServiceSearchDTO> getServicesByProviderAsDTO(Long providerId) {
        return serviceRepository.findByServiceProviderIdForSearch(providerId);
    }

    @Transactional
    public ServiceSearchDTO setSponsoredService(Long serviceId) {
        ServiceProvider provider = getCurrentServiceProvider();
        if (!provider.isSubscribed()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Provider is not subscribed. Subscription required to sponsor a service.");
        }

        ServiceModel serviceToSponsor = serviceRepository.findByIdAndServiceProviderId(serviceId, provider.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found or does not belong to this provider."));

        // Ensure provider sponsors only one service at a time
        provider.getServices().stream()
                .filter(s -> s.isSponsored() && !s.getId().equals(serviceId))
                .findFirst()
                .ifPresent(previouslySponsoredService -> {
                    previouslySponsoredService.setSponsored(false);
                    serviceRepository.save(previouslySponsoredService);
                });

        serviceToSponsor.setSponsored(true);
        ServiceModel savedService = serviceRepository.save(serviceToSponsor);
        return convertToServiceSearchDTO(savedService);
    }

    @Transactional
    public ServiceSearchDTO removeSponsoredService(Long serviceId) {
        ServiceProvider provider = getCurrentServiceProvider();
        ServiceModel serviceToUnSponsor = serviceRepository.findByIdAndServiceProviderId(serviceId, provider.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found or does not belong to this provider."));

        if (!serviceToUnSponsor.isSponsored()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service is not currently sponsored.");
        }

        serviceToUnSponsor.setSponsored(false);
        ServiceModel savedService = serviceRepository.save(serviceToUnSponsor);
        return convertToServiceSearchDTO(savedService);
    }

    private ServiceSearchDTO convertToServiceSearchDTO(ServiceModel service) {
        if (service == null) return null;
        ServiceProvider provider = service.getServiceProvider();
        Double averageRating = 0.0; // Placeholder - ideally fetched or calculated if this method is used for non-DTO sources

        return new ServiceSearchDTO(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getType(),
                service.getPrice(),
                service.getLocation(),
                provider != null ? provider.getBusinessName() : null,
                provider != null ? provider.getEmail() : null,
                averageRating, // Placeholder - ideally fetched or calculated if this method is used for non-DTO sources
                provider != null ? provider.getId() : null,
                service.getDuration(),
                service.isSponsored()
        );
    }
    
    // Other existing methods from ServiceService can remain here if any
}
    