package com.Group11.reno_connect.dto;

public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String businessName; // Relevant for ServiceProvider
    private String userType; // To distinguish between HomeOwner and ServiceProvider

    // Constructors
    public UserDTO() {
    }

    public UserDTO(Long id, String email, String firstName, String lastName, String businessName, String userType) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.businessName = businessName;
        this.userType = userType;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getUserType() {
        return userType;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
} 