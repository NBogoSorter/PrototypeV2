package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.dto.ChatMessageDTO;
import com.Group11.reno_connect.dto.ChatLogResponseDTO;
import com.Group11.reno_connect.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Get ChatLog and its messages for a given bookingId
    // Creates ChatLog if it doesn't exist for the booking
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("isAuthenticated()") // User must be authenticated
    public ResponseEntity<ChatLogResponseDTO> getChatForBooking(@PathVariable Long bookingId) {
        ChatLogResponseDTO chatLogResponseDTO = chatService.getOrCreateChatLogByBookingId(bookingId);
        return ResponseEntity.ok(chatLogResponseDTO);
    }

    // Post a new message to a specific chat log
    @PostMapping("/log/{chatLogId}/messages")
    @PreAuthorize("isAuthenticated()") // User must be authenticated
    public ResponseEntity<ChatMessageDTO> postMessageToChatLog(
            @PathVariable Long chatLogId,
            @Valid @RequestBody ChatMessageDTO chatMessageDTO) {
        ChatMessageDTO savedMessageDTO = chatService.saveMessage(chatLogId, chatMessageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessageDTO);
    }
} 