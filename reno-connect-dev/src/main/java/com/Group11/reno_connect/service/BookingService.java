package com.Group11.reno_connect.service;

import com.Group11.reno_connect.model.Booking;
import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.model.ServiceProvider;
import com.Group11.reno_connect.repository.BookingRepository;
import com.Group11.reno_connect.repository.ServiceProviderRepository;
import com.Group11.reno_connect.repository.ReviewRepository;
import com.Group11.reno_connect.dto.BookingResponseDTO;
import com.Group11.reno_connect.dto.BookingStatusUpdateDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public BookingService(BookingRepository bookingRepository, ServiceProviderRepository serviceProviderRepository, ReviewRepository reviewRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public BookingResponseDTO updateBooking(Long id, BookingStatusUpdateDTO statusUpdateDTO) {
        Booking bookingToUpdate = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        if (statusUpdateDTO.getStatus() != null) {
            String oldStatus = bookingToUpdate.getStatus();
            String newStatus = statusUpdateDTO.getStatus();
            bookingToUpdate.setStatus(newStatus);

            if ("COMPLETED".equalsIgnoreCase(newStatus) && !"COMPLETED".equalsIgnoreCase(oldStatus)) {
                ServiceProvider provider = bookingToUpdate.getServiceProvider();
                ServiceModel service = bookingToUpdate.getService();
                if (provider != null && service != null) {
                    double currentIncome = provider.getTotalIncome() != null ? provider.getTotalIncome() : 0.0;
                    provider.setTotalIncome(currentIncome + service.getPrice());
                    serviceProviderRepository.save(provider);
                }
            }
        }

        Booking updatedBooking = bookingRepository.save(bookingToUpdate);
        return convertToDTO(updatedBooking);
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        bookingRepository.delete(booking);
    }

    public List<BookingResponseDTO> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByHomeOwnerId(userId);
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getProviderBookings(Long providerId) {
        List<Booking> bookings = bookingRepository.findByServiceProviderId(providerId);
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllUserAssociatedBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findAllByUserId(userId);
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private BookingResponseDTO convertToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStatus(booking.getStatus());

        HomeOwner homeOwner = booking.getHomeOwner();
        if (homeOwner != null) {
            BookingResponseDTO.HomeOwnerDTO homeOwnerDTO = new BookingResponseDTO.HomeOwnerDTO(
                homeOwner.getId(),
                homeOwner.getFirstName(),
                homeOwner.getLastName()
            );
            dto.setHomeOwner(homeOwnerDTO);
        }

        ServiceModel serviceModel = booking.getService();
        if (serviceModel != null) {
            BookingResponseDTO.ServiceDTO serviceDTO = new BookingResponseDTO.ServiceDTO(
                serviceModel.getId(),
                serviceModel.getName(),
                serviceModel.getDuration()
            );
            dto.setService(serviceDTO);
        }
        
        ServiceProvider serviceProvider = booking.getServiceProvider();
        if (serviceProvider != null) {
            BookingResponseDTO.ServiceProviderDTO providerDTO = new BookingResponseDTO.ServiceProviderDTO(
                serviceProvider.getId(),
                serviceProvider.getBusinessName()
            );
            dto.setServiceProvider(providerDTO);
        }

        // Populate lastMessageSnippet
        if (booking.getChatLog() != null && booking.getChatLog().getLastMessageText() != null) {
            dto.setLastMessageSnippet(booking.getChatLog().getLastMessageText());
        } else {
            dto.setLastMessageSnippet("No messages yet."); // Default if no last message or no chat log
        }

        // Populate hasUserReviewed
        if (homeOwner != null && serviceModel != null) {
            boolean hasReviewed = reviewRepository.existsByHomeOwnerIdAndServiceId(homeOwner.getId(), serviceModel.getId());
            dto.setHasUserReviewed(hasReviewed);
        } else {
            dto.setHasUserReviewed(false); // Default if essential info is missing
        }

        return dto;
    }
} 