package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.dto.ReviewRequestDTO;
import com.Group11.reno_connect.model.Review;
import com.Group11.reno_connect.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000") // Allow CORS for frontend
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('HOMEOWNER')") // Only homeowners can create reviews
    public ResponseEntity<Review> createReview(@Valid @RequestBody ReviewRequestDTO reviewRequestDTO) {
        Review createdReview = reviewService.createReview(reviewRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }
} 