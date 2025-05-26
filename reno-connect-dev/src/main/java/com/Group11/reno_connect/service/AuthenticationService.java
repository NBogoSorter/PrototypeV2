package com.Group11.reno_connect.service;

import com.Group11.reno_connect.model.Admin;
import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.repository.AdminRepository;
import com.Group11.reno_connect.repository.HomeOwnerRepository;
import com.Group11.reno_connect.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import java.security.Key;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private HomeOwnerRepository homeOwnerRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Key jwtSecret;

    @PostConstruct
    public void init() {
        if (passwordEncoder != null) {
            logger.info("PasswordEncoder instance in AuthenticationService: {}", passwordEncoder.getClass().getName());
        } else {
            logger.error("PasswordEncoder was not injected into AuthenticationService!");
        }
    }

    private final long JWT_EXPIRATION = 86400000; // 24 hours

    public String login(String email, String password) {
        logger.info("Attempting login for email: {}", email);

        // Try to find user in HomeOwner repository
        HomeOwner homeOwner = homeOwnerRepository.findByEmail(email);
        if (homeOwner != null) {
            logger.info("Found HomeOwner with email: {}. Stored password hash: {}", email, homeOwner.getPassword());
            if (passwordEncoder.matches(password, homeOwner.getPassword())) {
                logger.info("Password match for HomeOwner: {}", email);
                return generateToken(homeOwner.getEmail(), "HOMEOWNER");
            } else {
                logger.warn("Password mismatch for HomeOwner: {}", email);
            }
        } else {
            logger.info("No HomeOwner found with email: {}", email);
        }

        // Try to find user in ServiceProvider repository
        ServiceProvider provider = serviceProviderRepository.findByEmail(email);
        if (provider != null) {
            logger.info("Found ServiceProvider with email: {}. Stored password hash: {}", email, provider.getPassword());
            if (passwordEncoder.matches(password, provider.getPassword())) {
                logger.info("Password match for ServiceProvider: {}", email);
                return generateToken(provider.getEmail(), "PROVIDER");
            } else {
                logger.warn("Password mismatch for ServiceProvider: {}", email);
            }
        } else {
            logger.info("No ServiceProvider found with email: {}", email);
        }

        // Try to find user in Admin repository
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            logger.info("Found Admin with email: {}. Stored password hash: {}", email, admin.getPassword());
            if (passwordEncoder.matches(password, admin.getPassword())) {
                logger.info("Password match for Admin: {}", email);
                return generateToken(admin.getEmail(), "ADMIN");
            } else {
                logger.warn("Password mismatch for Admin: {}", email);
            }
        } else {
            logger.info("No Admin found with email: {}", email);
        }

        logger.warn("Login failed for email: {}. Invalid email or password.", email);
        throw new RuntimeException("Invalid email or password");
    }

    public HomeOwner registerHomeOwner(HomeOwner homeOwner) {
        if (homeOwnerRepository.findByEmail(homeOwner.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        // Encode password before saving
        homeOwner.setPassword(passwordEncoder.encode(homeOwner.getPassword()));
        return homeOwnerRepository.save(homeOwner);
    }

    public ServiceProvider registerProvider(ServiceProvider provider) {
        if (serviceProviderRepository.findByEmail(provider.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        // Encode password before saving
        provider.setPassword(passwordEncoder.encode(provider.getPassword()));
        return serviceProviderRepository.save(provider);
    }

    private String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(jwtSecret)
                .compact();
    }
} 