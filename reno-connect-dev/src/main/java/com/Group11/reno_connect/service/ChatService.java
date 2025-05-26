package com.Group11.reno_connect.service;

import com.Group11.reno_connect.model.*;
import com.Group11.reno_connect.repository.*;
import com.Group11.reno_connect.dto.ChatMessageDTO;
import com.Group11.reno_connect.dto.ChatLogResponseDTO;
import com.Group11.reno_connect.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;
import java.util.ArrayList; // Added for initializing empty list
import java.util.List; // Added import for java.util.List

@Service
public class ChatService {

    @Autowired
    private ChatLogRepository chatLogRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private BookingRepository bookingRepository; // To fetch booking details

    @Autowired
    private UserRepository userRepository; // To fetch User for sender

    @Transactional // Keep @Transactional if ChatLog might be created
    public ChatLogResponseDTO getOrCreateChatLogByBookingId(Long bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Authorization: Ensure current user is part of the booking
        if (!booking.getHomeOwner().getId().equals(currentUser.getId()) && 
            !booking.getServiceProvider().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized for this chat");
        }

        ChatLog chatLog = chatLogRepository.findByBookingIdWithMessages(bookingId)
                .orElseGet(() -> {
                    ChatLog newChatLog = new ChatLog(booking);
                    // Initialize messages list if it's null, though @OneToMany usually initializes to an empty collection
                    if (newChatLog.getMessages() == null) {
                         newChatLog.setMessages(new ArrayList<>());
                    }
                    return chatLogRepository.save(newChatLog);
                });
        return convertToChatLogResponseDTO(chatLog);
    }

    @Transactional
    public ChatMessageDTO saveMessage(Long chatLogId, ChatMessageDTO chatMessageDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User sender = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sender not found"));

        ChatLog chatLog = chatLogRepository.findById(chatLogId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ChatLog not found"));

        Booking booking = chatLog.getBooking();
        if (booking == null || (!booking.getHomeOwner().getId().equals(sender.getId()) && !booking.getServiceProvider().getId().equals(sender.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to send messages to this chat log");
        }

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatLog(chatLog);
        chatMessage.setSender(sender);
        chatMessage.setMessageText(chatMessageDTO.getMessageText());
        
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        // Update ChatLog with the last message details
        String messageText = savedMessage.getMessageText();
        if (messageText != null && messageText.length() > 255) { // Truncate if necessary, matching ChatLog column length
            messageText = messageText.substring(0, 252) + "...";
        }
        chatLog.setLastMessageText(messageText);
        chatLog.setLastMessageTimestamp(savedMessage.getSentAt());
        chatLogRepository.save(chatLog); 

        return convertToChatMessageDTO(savedMessage);
    }

    private UserDTO convertToUserDTO(User user) {
        if (user == null) return null;
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        if (user instanceof HomeOwner) {
            HomeOwner ho = (HomeOwner) user;
            userDTO.setFirstName(ho.getFirstName());
            userDTO.setLastName(ho.getLastName());
            userDTO.setUserType("HOMEOWNER");
        } else if (user instanceof ServiceProvider) {
            ServiceProvider sp = (ServiceProvider) user;
            userDTO.setBusinessName(sp.getBusinessName());
            userDTO.setUserType("PROVIDER");
        }
        return userDTO;
    }

    private ChatMessageDTO convertToChatMessageDTO(ChatMessage message) {
        if (message == null) return null;
        return new ChatMessageDTO(
            message.getId(),
            message.getMessageText(),
            message.getSentAt(),
            convertToUserDTO(message.getSender()),
            message.getChatLog().getId(),
            message.isRead()
        );
    }

    private ChatLogResponseDTO convertToChatLogResponseDTO(ChatLog chatLog) {
        if (chatLog == null) return null;
        
        List<ChatMessageDTO> messageDTOs = new ArrayList<>();
        if (chatLog.getMessages() != null) {
            messageDTOs = chatLog.getMessages().stream()
                                .map(this::convertToChatMessageDTO)
                                .collect(Collectors.toList());
        }
        
        UserDTO homeOwnerDTO = null;
        UserDTO serviceProviderDTO = null;
        if (chatLog.getBooking() != null) {
            homeOwnerDTO = convertToUserDTO(chatLog.getBooking().getHomeOwner());
            serviceProviderDTO = convertToUserDTO(chatLog.getBooking().getServiceProvider());
        }

        return new ChatLogResponseDTO(
            chatLog.getId(),
            chatLog.getBooking() != null ? chatLog.getBooking().getId() : null, // Handle potential null booking if something went wrong
            chatLog.getCreatedAt(),
            messageDTOs,
            homeOwnerDTO,
            serviceProviderDTO
        );
    }

    // Potentially a method to get messages if ChatLog.messages is LAZY fetched and not handled by findByBookingIdWithMessages
    // public List<ChatMessage> getMessagesForChatLog(Long chatLogId) {
    //     return chatMessageRepository.findByChatLogIdOrderBySentAtAsc(chatLogId);
    // }
} 