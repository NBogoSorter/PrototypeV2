package com.Group11.reno_connect.dto;

public class ServiceSearchDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private Double price;
    private String location;
    private String providerName;
    private String providerEmail;
    private Double averageRating;
    private Long providerId;
    private Integer duration;
    private boolean isSponsored;

    public ServiceSearchDTO(Long id, String name, String description, String type, 
                          Double price, String location, 
                          String providerName, String providerEmail,
                          Double averageRating, Long providerId, Integer duration,
                          boolean isSponsored) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.price = price;
        this.location = location;
        this.providerName = providerName;
        this.providerEmail = providerEmail;
        this.averageRating = averageRating;
        this.providerId = providerId;
        this.duration = duration;
        this.isSponsored = isSponsored;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    
    public String getProviderEmail() { return providerEmail; }
    public void setProviderEmail(String providerEmail) { this.providerEmail = providerEmail; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public boolean isSponsored() { return isSponsored; }
    public void setSponsored(boolean sponsored) { isSponsored = sponsored; }
} 