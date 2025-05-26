package com.Group11.reno_connect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "chat_message")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_log_id", nullable = false)
    @JsonBackReference("chatlog-messages")
    private ChatLog chatLog;

    @ManyToOne(fetch = FetchType.LAZY) // Eager might be fine if user details are always needed
    @JoinColumn(name = "sender_user_id", nullable = false)
    private User sender; // References the User table for sender info

    @Lob // For potentially long messages
    @Column(nullable = false)
    private String messageText;

    @Column(nullable = false, updatable = false)
    private LocalDateTime sentAt;

    private boolean isRead = false;

    @PrePersist
    protected void onSend() {
        sentAt = LocalDateTime.now();
    }

    // Constructors
    public ChatMessage() {
    }

    public ChatMessage(ChatLog chatLog, User sender, String messageText) {
        this.chatLog = chatLog;
        this.sender = sender;
        this.messageText = messageText;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChatLog getChatLog() {
        return chatLog;
    }

    public void setChatLog(ChatLog chatLog) {
        this.chatLog = chatLog;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
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

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
} 