package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.dto.SubscriptionRequestDTO;
import com.Group11.reno_connect.dto.SubscriptionStatusDTO;
import com.Group11.reno_connect.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subscriptions") // Base path for subscription related actions
@PreAuthorize("hasRole('PROVIDER')") // Ensures only providers can access these endpoints
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionStatusDTO> subscribe(@RequestBody SubscriptionRequestDTO subscriptionRequestDTO) {
        SubscriptionStatusDTO status = subscriptionService.subscribe(subscriptionRequestDTO);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<SubscriptionStatusDTO> unsubscribe() {
        SubscriptionStatusDTO status = subscriptionService.unsubscribe();
        return ResponseEntity.ok(status);
    }

    @GetMapping("/status")
    public ResponseEntity<SubscriptionStatusDTO> getSubscriptionStatus() {
        SubscriptionStatusDTO status = subscriptionService.getSubscriptionStatus();
        return ResponseEntity.ok(status);
    }
} 