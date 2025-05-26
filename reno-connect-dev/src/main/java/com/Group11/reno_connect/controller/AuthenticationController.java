package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.service.AuthenticationService;
import com.Group11.reno_connect.dto.LoginRequest;
import com.Group11.reno_connect.dto.AuthResponse;
import com.Group11.reno_connect.dto.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authenticationService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/homeowner/register")
    public ResponseEntity<?> registerHomeOwner(@RequestBody HomeOwner homeOwner) {
        try {
            HomeOwner registered = authenticationService.registerHomeOwner(homeOwner);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/provider/register")
    public ResponseEntity<?> registerProvider(@RequestBody ServiceProvider provider) {
        try {
            ServiceProvider registered = authenticationService.registerProvider(provider);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
} 