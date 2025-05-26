package com.Group11.reno_connect.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ChatLogResponseDTO {
    private Long id;
    private Long bookingId;
    private LocalDateTime createdAt;
    private List<ChatMessageDTO> messages; // Use the enhanced ChatMessageDTO
    // Optionally, include simplified DTOs for HomeOwner and ServiceProvider involved in the booking
    private UserDTO homeOwner;
    private UserDTO serviceProvider;

    public ChatLogResponseDTO() {
    }

    public ChatLogResponseDTO(Long id, Long bookingId, LocalDateTime createdAt, List<ChatMessageDTO> messages, UserDTO homeOwner, UserDTO serviceProvider) {
        this.id = id;
        this.bookingId = bookingId;
        this.createdAt = createdAt;
        this.messages = messages;
        this.homeOwner = homeOwner;
        this.serviceProvider = serviceProvider;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ChatMessageDTO> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageDTO> messages) {
        this.messages = messages;
    }

    public UserDTO getHomeOwner() {
        return homeOwner;
    }

    public void setHomeOwner(UserDTO homeOwner) {
        this.homeOwner = homeOwner;
    }

    public UserDTO getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(UserDTO serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
} 