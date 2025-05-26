package com.Group11.reno_connect.service;

import com.Group11.reno_connect.dto.ReviewRequestDTO;
import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.model.Review;
import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.repository.HomeOwnerRepository;
import com.Group11.reno_connect.repository.ReviewRepository;
import com.Group11.reno_connect.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private HomeOwnerRepository homeOwnerRepository;

    @Transactional
    public Review createReview(ReviewRequestDTO reviewRequestDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        HomeOwner homeOwner = homeOwnerRepository.findByEmail(email);
        if (homeOwner == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "HomeOwner not found for the current user.");
        }

        ServiceModel service = serviceRepository.findById(reviewRequestDTO.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + reviewRequestDTO.getServiceId()));

        // Optional: Check if the homeowner has booked this service before allowing a review
        // This would require checking the Booking entities.

        Review review = new Review();
        review.setComment(reviewRequestDTO.getComment());
        review.setRating(reviewRequestDTO.getRating());
        review.setService(service);
        review.setHomeOwner(homeOwner);

        return reviewRepository.save(review);
    }
} 