package com.Group11.reno_connect.repository;

import com.Group11.reno_connect.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatLogIdOrderBySentAtAsc(Long chatLogId);
} 