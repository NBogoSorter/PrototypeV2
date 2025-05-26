package com.Group11.reno_connect.dto;

public class UserViewDTO {
    private Long id;
    private String email;
    private String userType; // "HOMEOWNER" or "PROVIDER"
    private String firstName; // For HomeOwner
    private String lastName; // For HomeOwner
    private String businessName; // For ServiceProvider
    private String phoneNumber;
    private String address;
    private Double averageRating; // For ServiceProvider

    public UserViewDTO() {
    }

    public UserViewDTO(Long id, String email, String userType, String firstName, String lastName, String businessName, String phoneNumber, String address, Double averageRating) {
        this.id = id;
        this.email = email;
        this.userType = userType;
        this.firstName = firstName;
        this.lastName = lastName;
        this.businessName = businessName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.averageRating = averageRating;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
} 