package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.repository.HomeOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/homeowner")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeOwnerController {

    @Autowired
    private HomeOwnerRepository homeOwnerRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        HomeOwner homeOwner = homeOwnerRepository.findByEmail(email);
        
        if (homeOwner == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Don't send the password back to the client
        homeOwner.setPassword(null);
        return ResponseEntity.ok(homeOwner);
    }

    // ... existing code ...
} 