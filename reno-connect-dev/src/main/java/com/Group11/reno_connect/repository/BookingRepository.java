package com.Group11.reno_connect.repository;

import com.Group11.reno_connect.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByHomeOwnerId(Long homeOwnerId);
    List<Booking> findByServiceProviderId(Long serviceProviderId);

    // New method to find bookings where the user is either homeowner or service provider
    @Query("SELECT b FROM Booking b WHERE b.homeOwner.id = :userId OR b.serviceProvider.id = :userId")
    List<Booking> findAllByUserId(@Param("userId") Long userId);
} 