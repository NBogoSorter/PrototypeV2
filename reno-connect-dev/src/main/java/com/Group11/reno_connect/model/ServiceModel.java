package com.Group11.reno_connect.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;


@Entity
@Table(name = "service")
public class ServiceModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String type;
    private Double price;
    private Integer duration;
    private String location;

    @Column(name = "is_sponsored", columnDefinition = "boolean default false")
    private boolean isSponsored = false;

    public ServiceModel(String name, String description, String type, Double price, String location, Integer duration) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.price = price;
        this.location = location;
        this.duration = duration;
    }

    /*
    @ManyToOne
    @JoinColumn(name = "home_owner_id")
    private HomeOwner homeOwner;
    */

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    @JsonBackReference("provider-services")
    private ServiceProvider serviceProvider;

    @OneToMany(mappedBy = "service")
    @JsonManagedReference("service-bookings")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "service")
    @JsonManagedReference("service-reviews")
    private List<Review> reviews;

    public ServiceModel(){}

    public Long getId(){
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName(){
        return name;
    }

    public String getDescription(){
        return description;
    }

    public String getType(){
        return type;
    }

    public Double getPrice(){
        return price;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getLocation(){
        return location;
    }

    public void setName(String name){
        this.name = name;
    }
    
    public void setDescription(String description){
        this.description = description;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isSponsored() {
        return isSponsored;
    }

    public void setSponsored(boolean sponsored) {
        isSponsored = sponsored;
    }

    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}