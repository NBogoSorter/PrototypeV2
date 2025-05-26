package com.Group11.reno_connect.dto;

public class ServiceDetailDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private Double price;
    private String location;
    private String providerName; // Important: For the provider's business name
    private Integer duration; // Added duration back
    private Double averageRating; // Added averageRating
    // private String providerEmail; // Optional, if needed
    // private Double averageRating; // Optional, if needed and calculable here

    // Constructor
    public ServiceDetailDTO(Long id, String name, String description, String type, 
                            Double price, String location, 
                            String providerName, Integer duration, Double averageRating) { // Added duration and averageRating to constructor
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.price = price;
        this.location = location;
        this.providerName = providerName;
        this.duration = duration; // Initialize duration
        this.averageRating = averageRating; // Initialize averageRating
    }

    // Getters and Setters
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

    public Integer getDuration() { return duration; } // Added getter for duration
    public void setDuration(Integer duration) { this.duration = duration; } // Added setter for duration

    public Double getAverageRating() { return averageRating; } // Added getter for averageRating
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; } // Added setter for averageRating
} 