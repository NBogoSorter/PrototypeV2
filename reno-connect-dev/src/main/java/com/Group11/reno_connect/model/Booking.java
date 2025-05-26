package com.Group11.reno_connect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.OneToOne;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "booking")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime bookingDate;
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonBackReference("service-bookings")
    private ServiceModel service;
    
    @ManyToOne
    @JoinColumn(name = "home_owner_id")
    @JsonBackReference("homeowner-bookings")
    private HomeOwner homeOwner;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    @JsonBackReference("provider-bookings")
    private ServiceProvider serviceProvider;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("booking-chatlog")
    private ChatLog chatLog;

    public Booking() {}

    public Booking(LocalDateTime bookingDate, String status, ServiceModel service, HomeOwner homeOwner, ServiceProvider serviceProvider) {
        this.bookingDate = bookingDate;
        this.status = status;
        this.service = service;
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

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ServiceModel getService() {
        return service;
    }

    public void setService(ServiceModel service) {
        this.service = service;
    }

    public HomeOwner getHomeOwner() {
        return homeOwner;
    }

    public void setHomeOwner(HomeOwner homeOwner) {
        this.homeOwner = homeOwner;
    }

    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    public ChatLog getChatLog() {
        return chatLog;
    }

    public void setChatLog(ChatLog chatLog) {
        this.chatLog = chatLog;
    }
}
