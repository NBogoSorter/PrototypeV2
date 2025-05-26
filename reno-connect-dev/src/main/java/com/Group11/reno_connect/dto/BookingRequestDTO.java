package com.Group11.reno_connect.dto;

import java.time.LocalDateTime;

public class BookingRequestDTO {
    private Long serviceId;
    private LocalDateTime bookingDate;

    // Constructors
    public BookingRequestDTO() {
    }

    public BookingRequestDTO(Long serviceId, LocalDateTime bookingDate) {
        this.serviceId = serviceId;
        this.bookingDate = bookingDate;
    }

    // Getters and Setters
    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }
} 