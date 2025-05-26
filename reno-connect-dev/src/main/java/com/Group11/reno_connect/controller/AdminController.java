package com.Group11.reno_connect.controller;

import com.Group11.reno_connect.dto.UserViewDTO;
import com.Group11.reno_connect.dto.UserUpdateDTO;
import com.Group11.reno_connect.model.Admin;
import com.Group11.reno_connect.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')") //Ensures only users with ADMIN role can access these endpoints
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserViewDTO>> getAllUsers() {
        List<UserViewDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/filter")
    public ResponseEntity<List<UserViewDTO>> filterUsers(
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String email) {
        List<UserViewDTO> users = adminService.filterUsers(userType, email);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserViewDTO> updateUser(
            @PathVariable Long userId,
            @RequestBody UserUpdateDTO userUpdateDTO) {
        UserViewDTO updatedUser = adminService.updateUser(userId, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/users")
    public ResponseEntity<UserViewDTO> createAdmin(@RequestBody Map<String, String> adminData) {
        Admin admin = new Admin();
        admin.setEmail(adminData.get("email"));
        admin.setPassword(adminData.get("password"));
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }
} 