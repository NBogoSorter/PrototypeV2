package com.Group11.reno_connect.repository;

import com.Group11.reno_connect.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByHomeOwnerIdAndServiceId(Long homeOwnerId, Long serviceId);
    
    @Query("SELECT AVG(r.rating) FROM Review r JOIN r.service s WHERE s.serviceProvider.id = :providerId")
    Optional<Double> findAverageRatingByProviderId(@Param("providerId") Long providerId);
} 