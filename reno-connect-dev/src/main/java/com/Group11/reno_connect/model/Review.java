package com.Group11.reno_connect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "review", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"home_owner_id", "service_id"})
})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private int rating;

    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonBackReference("service-reviews")
    private ServiceModel service;

    @ManyToOne
    @JoinColumn(name = "home_owner_id")
    @JsonBackReference("homeowner-reviews")
    private HomeOwner homeOwner;

    public Review(String comment, int rating, ServiceModel service, HomeOwner homeOwner) {
        this.comment = comment;
        this.rating = rating;
        this.service = service;
        this.homeOwner = homeOwner;
    }

    public Review(){}

    public Long getId(){
        return id;
    }

    public String getComment(){
        return comment;
    }

    public int getRating(){
        return rating;
    }

    public ServiceModel getService() {
        return service;
    }

    public HomeOwner getHomeOwner() {
        return homeOwner;
    }

    public void setComment(String comment){
        this.comment = comment;
    }
    
    public void setRating(int rating){
        this.rating = rating;
    }

    public void setService(ServiceModel service) {
        this.service = service;
    }

    public void setHomeOwner(HomeOwner homeOwner) {
        this.homeOwner = homeOwner;
    }
}   