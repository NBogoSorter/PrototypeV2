package com.Group11.reno_connect.dto;

public class BookingStatusUpdateDTO {
    private String status;

    // Default constructor
    public BookingStatusUpdateDTO() {
    }

    // Constructor with status
    public BookingStatusUpdateDTO(String status) {
        this.status = status;
    }

    // Getter
    public String getStatus() {
        return status;
    }

    // Setter
    public void setStatus(String status) {
        this.status = status;
    }
} 