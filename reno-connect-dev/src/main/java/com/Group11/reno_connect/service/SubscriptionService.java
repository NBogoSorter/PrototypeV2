package com.Group11.reno_connect.service;

import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.repository.ServiceProviderRepository;
import com.Group11.reno_connect.repository.ServiceRepository;
import com.Group11.reno_connect.dto.SubscriptionRequestDTO;
import com.Group11.reno_connect.dto.SubscriptionStatusDTO;
import com.Group11.reno_connect.model.User;
import com.Group11.reno_connect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceRepository serviceRepository;

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

    @Transactional
    public SubscriptionStatusDTO subscribe(SubscriptionRequestDTO subscriptionRequestDTO) {
        ServiceProvider provider = getCurrentServiceProvider();
        
        // Mock payment processing - in a real app, integrate with a payment gateway
        System.out.println("Processing payment for provider: " + provider.getEmail() + " with card: " + subscriptionRequestDTO.getCardNumber());

        provider.setSubscribed(true);
        provider.setSubscriptionEndDate(LocalDateTime.now().plusDays(30)); // Subscription for 30 days
        serviceProviderRepository.save(provider);
        return getSubscriptionStatus();
    }

    @Transactional
    public SubscriptionStatusDTO unsubscribe() {
        ServiceProvider provider = getCurrentServiceProvider();
        provider.setSubscribed(false);
        provider.setSubscriptionEndDate(null);

        // Un-sponsor any service this provider had sponsored
        Optional<ServiceModel> currentlySponsored = provider.getServices().stream()
            .filter(ServiceModel::isSponsored)
            .findFirst();
        if (currentlySponsored.isPresent()) {
            ServiceModel service = currentlySponsored.get();
            service.setSponsored(false);
            serviceRepository.save(service);
        }

        serviceProviderRepository.save(provider);
        return getSubscriptionStatus();
    }

    public SubscriptionStatusDTO getSubscriptionStatus() {
        ServiceProvider provider = getCurrentServiceProvider();
        Long sponsoredServiceId = provider.getServices().stream()
            .filter(ServiceModel::isSponsored)
            .findFirst()
            .map(ServiceModel::getId)
            .orElse(null);
        return new SubscriptionStatusDTO(provider.isSubscribed(), provider.getSubscriptionEndDate(), sponsoredServiceId);
    }

    // Scheduled task to run daily (e.g., at midnight) to check for expired subscriptions
    @Scheduled(cron = "0 0 0 * * ?") // Run every day at midnight
    @Transactional
    public void checkExpiredSubscriptions() {
        System.out.println("Running scheduled task to check for expired subscriptions...");
        List<ServiceProvider> providers = serviceProviderRepository.findAllByIsSubscribedTrueAndSubscriptionEndDateBefore(LocalDateTime.now());
        for (ServiceProvider provider : providers) {
            System.out.println("Subscription expired for provider: " + provider.getEmail());
            provider.setSubscribed(false);
            provider.setSubscriptionEndDate(null);
            // Un-sponsor their service
            provider.getServices().stream()
                .filter(ServiceModel::isSponsored)
                .findFirst()
                .ifPresent(service -> {
                    service.setSponsored(false);
                    serviceRepository.save(service);
                    System.out.println("Un-sponsored service ID: " + service.getId() + " for provider: " + provider.getEmail());
                });
            serviceProviderRepository.save(provider);
        }
    }
} 