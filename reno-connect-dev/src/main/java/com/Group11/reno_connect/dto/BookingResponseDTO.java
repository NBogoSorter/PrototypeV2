package com.Group11.reno_connect.dto;

import java.time.LocalDateTime;

public class BookingResponseDTO {
    private Long id;
    private LocalDateTime bookingDate;
    private String status;
    private HomeOwnerDTO homeOwner;
    private ServiceDTO service;
    private ServiceProviderDTO serviceProvider;
    private String lastMessageSnippet;
    private boolean hasUserReviewed;

    // Nested DTO for HomeOwner (simplified)
    public static class HomeOwnerDTO {
        private Long id;
        private String firstName;
        private String lastName;

        public HomeOwnerDTO() {}
        public HomeOwnerDTO(Long id, String firstName, String lastName) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
        }
        // Getters
        public Long getId() { return id; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        // Setters
        public void setId(Long id) { this.id = id; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }

    // Nested DTO for ServiceModel (simplified)
    public static class ServiceDTO {
        private Long id;
        private String name;
        private Integer duration;
        
        public ServiceDTO() {}
        public ServiceDTO(Long id, String name, Integer duration) {
            this.id = id;
            this.name = name;
            this.duration = duration;
        }
        // Getters
        public Long getId() { return id; }
        public String getName() { return name; }
        // Setters
        public void setId(Long id) { this.id = id; }
        public void setName(String name) { this.name = name; }
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
    }
    
    // Nested DTO for ServiceProvider (simplified)
    public static class ServiceProviderDTO {
        private Long id;
        private String businessName;

        public ServiceProviderDTO() {}
        public ServiceProviderDTO(Long id, String businessName) {
            this.id = id;
            this.businessName = businessName;
        }
        // Getters
        public Long getId() { return id; }
        public String getBusinessName() { return businessName; }
        // Setters
        public void setId(Long id) { this.id = id; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
    }

    // Constructor for BookingResponseDTO
    public BookingResponseDTO(Long id, LocalDateTime bookingDate, String status, HomeOwnerDTO homeOwner, ServiceDTO service, ServiceProviderDTO serviceProvider) {
        this.id = id;
        this.bookingDate = bookingDate;
        this.status = status;
        this.homeOwner = homeOwner;
        this.service = service;
        this.serviceProvider = serviceProvider;
    }
    
    public BookingResponseDTO() {}

    // Getters
    public Long getId() { return id; }
    public LocalDateTime getBookingDate() { return bookingDate; }
    public String getStatus() { return status; }
    public HomeOwnerDTO getHomeOwner() { return homeOwner; }
    public ServiceDTO getService() { return service; }
    public ServiceProviderDTO getServiceProvider() { return serviceProvider; }
    public String getLastMessageSnippet() { return lastMessageSnippet; }
    public boolean getHasUserReviewed() { return hasUserReviewed; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    public void setStatus(String status) { this.status = status; }
    public void setHomeOwner(HomeOwnerDTO homeOwner) { this.homeOwner = homeOwner; }
    public void setService(ServiceDTO service) { this.service = service; }
    public void setServiceProvider(ServiceProviderDTO serviceProvider) { this.serviceProvider = serviceProvider; }
    public void setLastMessageSnippet(String lastMessageSnippet) { this.lastMessageSnippet = lastMessageSnippet; }
    public void setHasUserReviewed(boolean hasUserReviewed) { this.hasUserReviewed = hasUserReviewed; }
} 