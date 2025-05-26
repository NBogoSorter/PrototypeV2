package com.Group11.reno_connect.repository;

import com.Group11.reno_connect.model.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    Optional<ChatLog> findByBookingId(Long bookingId);

    // To fetch chat log with messages eagerly if needed, though ChatLog entity already has EAGER fetch for messages
    @Query("SELECT cl FROM ChatLog cl LEFT JOIN FETCH cl.messages WHERE cl.booking.id = :bookingId")
    Optional<ChatLog> findByBookingIdWithMessages(@Param("bookingId") Long bookingId);

} 