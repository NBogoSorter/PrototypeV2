package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.dto.BookingRequestDTO;
import com.Group11.reno_connect.dto.BookingResponseDTO;
import com.Group11.reno_connect.dto.BookingStatusUpdateDTO;
import com.Group11.reno_connect.model.Booking;
import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.service.BookingService;
import com.Group11.reno_connect.repository.HomeOwnerRepository;
import com.Group11.reno_connect.repository.ServiceRepository;
import com.Group11.reno_connect.repository.ServiceProviderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    private final BookingService bookingService;
    private final HomeOwnerRepository homeOwnerRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceModelRepository;

    public BookingController(BookingService bookingService,
                           HomeOwnerRepository homeOwnerRepository,
                           ServiceProviderRepository serviceProviderRepository,
                           ServiceRepository serviceModelRepository) {
        this.bookingService = bookingService;
        this.homeOwnerRepository = homeOwnerRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceModelRepository = serviceModelRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDTO bookingRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User must be logged in to create a booking.");
        }
        String email = authentication.getName();
        HomeOwner homeOwner = homeOwnerRepository.findByEmail(email);

        if (homeOwner == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "HomeOwner profile not found for the logged-in user.");
        }

        ServiceModel service = serviceModelRepository.findById(bookingRequest.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + bookingRequest.getServiceId()));

        ServiceProvider serviceProvider = service.getServiceProvider();
        if (serviceProvider == null) {
             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Service provider not found for the selected service.");
        }

        Booking newBooking = new Booking();
        newBooking.setBookingDate(bookingRequest.getBookingDate());
        newBooking.setService(service);
        newBooking.setHomeOwner(homeOwner);
        newBooking.setServiceProvider(serviceProvider);
        newBooking.setStatus("PENDING"); // Default status

        Booking createdBooking = bookingService.createBooking(newBooking);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> updateBooking(@PathVariable Long id, @RequestBody BookingStatusUpdateDTO statusUpdateDTO) {
        try {
            BookingResponseDTO updatedBookingDTO = bookingService.updateBooking(id, statusUpdateDTO);
            return ResponseEntity.ok(updatedBookingDTO);
        } catch (RuntimeException e) {
            logger.error("Error updating booking with id {}: {}", id, e.getMessage());
            if (e instanceof ResponseStatusException) {
                throw e;
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<BookingResponseDTO>> getAllUserAssociatedBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("[getAllUserAssociatedBookings] Authenticated user email: {}", email);
        
        Long userId = null;
        String userRole = "UNKNOWN"; // For logging

        HomeOwner homeOwner = homeOwnerRepository.findByEmail(email);
        if (homeOwner != null) {
            userId = homeOwner.getId();
            userRole = "HOMEOWNER";
            logger.info("[getAllUserAssociatedBookings] User identified as HomeOwner. ID: {}", userId);
        } else {
            logger.info("[getAllUserAssociatedBookings] User not found as HomeOwner. Checking if ServiceProvider...");
            ServiceProvider serviceProvider = serviceProviderRepository.findByEmail(email);
            if (serviceProvider != null) {
                userId = serviceProvider.getId();
                userRole = "SERVICE_PROVIDER";
                logger.info("[getAllUserAssociatedBookings] User identified as ServiceProvider. ID: {}", userId);
            } else {
                logger.warn("[getAllUserAssociatedBookings] User not found as HomeOwner or ServiceProvider for email: {}", email);
            }
        }

        if (userId == null) {
            logger.error("[getAllUserAssociatedBookings] Failed to identify user ID for email: {}. Returning 404.", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(null); 
        }

        logger.info("[getAllUserAssociatedBookings] Fetching all associated bookings for User ID: {}, Role: {}", userId, userRole);
        List<BookingResponseDTO> bookings = bookingService.getAllUserAssociatedBookings(userId);
        logger.info("[getAllUserAssociatedBookings] Found {} bookings for User ID: {}", bookings.size(), userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider")
    public ResponseEntity<List<BookingResponseDTO>> getProviderBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("[getProviderBookings] Authenticated provider email: {}", email);
        ServiceProvider provider = serviceProviderRepository.findByEmail(email);

        if (provider == null) {
            logger.warn("[getProviderBookings] ServiceProvider not found for email: {}. Returning 404.", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        logger.info("[getProviderBookings] Fetching bookings for Provider ID: {}", provider.getId());
        List<BookingResponseDTO> bookings = bookingService.getProviderBookings(provider.getId());
        logger.info("[getProviderBookings] Found {} bookings for Provider ID: {}", bookings.size(), provider.getId());
        return ResponseEntity.ok(bookings);
    }

} 