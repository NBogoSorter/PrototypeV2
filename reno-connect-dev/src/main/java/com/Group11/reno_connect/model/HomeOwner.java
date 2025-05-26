package com.Group11.reno_connect.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "home_owner")
@Inheritance(strategy = InheritanceType.JOINED)
public class HomeOwner extends User {

    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    private String address;
    private String phoneNumber;
    
    public HomeOwner(String firstName, String lastName, String email, String password, String address, String phoneNumber) {
        super(email, password);
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }

    public HomeOwner() {
        super();
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

    public String getAddress() {
        return address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    @OneToMany(mappedBy = "homeOwner")
    @JsonManagedReference("homeowner-bookings")
    private List<Booking> bookings;

    public List<Booking> getBookings(){
        return bookings;
    }

    public void setBookings(List<Booking> bookings){
        this.bookings = bookings;
    }

    @OneToMany(mappedBy = "homeOwner")
    @JsonManagedReference("homeowner-reviews")
    private List<Review> reviews;

    public List<Review> getReviews(){
        return reviews;
    }
}
