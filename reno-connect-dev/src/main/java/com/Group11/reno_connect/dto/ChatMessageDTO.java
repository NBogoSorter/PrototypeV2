package com.Group11.reno_connect.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ChatMessageDTO {

    private Long id; // ID of the chat message itself

    @NotBlank(message = "Message text cannot be blank")
    private String messageText;
    private LocalDateTime sentAt;
    private UserDTO sender; // DTO for the sender information
    private Long chatLogId; // ID of the chat log this message belongs to
    private Boolean isRead; // isRead status

    // No-argument constructor
    public ChatMessageDTO() {
    }

    // Constructor for incoming message (only text is needed from client)
    public ChatMessageDTO(String messageText) {
        this.messageText = messageText;
    }

    // Full constructor for outgoing message (populated from entity)
    public ChatMessageDTO(Long id, String messageText, LocalDateTime sentAt, UserDTO sender, Long chatLogId, Boolean isRead) {
        this.id = id;
        this.messageText = messageText;
        this.sentAt = sentAt;
        this.sender = sender;
        this.chatLogId = chatLogId;
        this.isRead = isRead;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public UserDTO getSender() {
        return sender;
    }

    public void setSender(UserDTO sender) {
        this.sender = sender;
    }

    public Long getChatLogId() {
        return chatLogId;
    }

    public void setChatLogId(Long chatLogId) {
        this.chatLogId = chatLogId;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean read) {
        isRead = read;
    }
} 