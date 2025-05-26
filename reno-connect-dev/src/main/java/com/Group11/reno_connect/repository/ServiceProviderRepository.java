package com.Group11.reno_connect.repository;

import com.Group11.reno_connect.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    ServiceProvider findByEmail(String email);
    Optional<ServiceProvider> findById(Long id);
    // Add custom query methods if needed

    // Method for scheduled task to find expired subscriptions
    List<ServiceProvider> findAllByIsSubscribedTrueAndSubscriptionEndDateBefore(LocalDateTime currentDate);
} 