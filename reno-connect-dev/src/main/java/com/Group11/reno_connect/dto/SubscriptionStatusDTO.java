package com.Group11.reno_connect.dto;

import java.time.LocalDateTime;

public class SubscriptionStatusDTO {
    private boolean isSubscribed;
    private LocalDateTime subscriptionEndDate;
    private Long sponsoredServiceId; // ID of the currently sponsored service, null if none

    // Constructors
    public SubscriptionStatusDTO() {
    }

    public SubscriptionStatusDTO(boolean isSubscribed, LocalDateTime subscriptionEndDate, Long sponsoredServiceId) {
        this.isSubscribed = isSubscribed;
        this.subscriptionEndDate = subscriptionEndDate;
        this.sponsoredServiceId = sponsoredServiceId;
    }

    // Getters and Setters
    public boolean isSubscribed() {
        return isSubscribed;
    }

    public void setSubscribed(boolean subscribed) {
        isSubscribed = subscribed;
    }

    public LocalDateTime getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(LocalDateTime subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public Long getSponsoredServiceId() {
        return sponsoredServiceId;
    }

    public void setSponsoredServiceId(Long sponsoredServiceId) {
        this.sponsoredServiceId = sponsoredServiceId;
    }
} 