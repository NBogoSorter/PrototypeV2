package com.Group11.reno_connect.dto;

public class SubscriptionRequestDTO {
    private String cardNumber;
    private String expiryDate; // e.g., "MM/YY"
    private String cvc;
    private String nameOnCard;

    // Constructors
    public SubscriptionRequestDTO() {
    }

    public SubscriptionRequestDTO(String cardNumber, String expiryDate, String cvc, String nameOnCard) {
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.cvc = cvc;
        this.nameOnCard = nameOnCard;
    }

    // Getters and Setters
    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvc() {
        return cvc;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    public String getNameOnCard() {
        return nameOnCard;
    }

    public void setNameOnCard(String nameOnCard) {
        this.nameOnCard = nameOnCard;
    }
} 