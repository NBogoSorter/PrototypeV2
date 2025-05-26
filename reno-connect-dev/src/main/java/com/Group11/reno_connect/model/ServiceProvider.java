package com.Group11.reno_connect.model;

import java.util.List;
import java.util.Objects; // For equals and hashCode
import java.time.LocalDateTime; // Ensured for subscriptionEndDate
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Column;
import jakarta.persistence.CascadeType; // For cascade operations if needed
import jakarta.persistence.FetchType; // For fetch types if needed
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "service_provider")
@Inheritance(strategy = InheritanceType.JOINED)
public class ServiceProvider extends User {

    @Column(name = "business_name", unique = true)
    private String businessName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "total_income")
    private Double totalIncome = 0.0;

    @Column(name = "is_subscribed", columnDefinition = "boolean default false")
    private boolean isSubscribed = false;

    @Column(name = "subscription_end_date")
    private LocalDateTime subscriptionEndDate;

    @OneToMany(mappedBy = "serviceProvider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("provider-services")
    private Set<ServiceModel> services = new HashSet<>();

    @OneToMany(mappedBy = "serviceProvider", fetch = FetchType.LAZY)
    @JsonManagedReference("provider-bookings")
    private List<Booking> bookings;

    // No-argument constructor
    public ServiceProvider() {
        super(); // Call superclass constructor
        this.totalIncome = 0.0; // Explicitly initialize, though already done at declaration
    }
    
    // Existing constructor
    public ServiceProvider(String businessName, String email, String password, String address, String phoneNumber) {
        super(email, password);
        this.businessName = businessName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.totalIncome = 0.0; // Initialize totalIncome
    }

    // Getters and Setters

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Set<ServiceModel> getServices() {
        return services;
    }

    public void setServices(Set<ServiceModel> services) {
        this.services = services;
    }

    public List<Booking> getBookings(){
        return bookings;
    }

    public void setBookings(List<Booking> bookings){
        this.bookings = bookings;
    }

    // Getters and Setters for new fields
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

    // equals, hashCode, and toString methods (optional, but good practice for entities)

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false; // Include superclass fields if User has its own equals
        ServiceProvider that = (ServiceProvider) o;
        return Objects.equals(getId(), that.getId()) && // Assuming getId() from User or this class
               Objects.equals(businessName, that.businessName) &&
               Objects.equals(address, that.address) &&
               Objects.equals(phoneNumber, that.phoneNumber) &&
               Objects.equals(totalIncome, that.totalIncome);
    }

    @Override
    public int hashCode() {
        // Include superclass fields if User has its own hashCode
        return Objects.hash(super.hashCode(), getId(), businessName, address, phoneNumber, totalIncome);
    }

    @Override
    public String toString() {
        return "ServiceProvider{" +
                "id=" + getId() + // Assuming getId() from User or this class
                ", email='" + getEmail() + '\'' + // Assuming getEmail() from User
                ", businessName='" + businessName + '\'' +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", totalIncome=" + totalIncome +
                // Omitting lists from toString to avoid long output and potential circular dependency issues
                '}';
    }
}
