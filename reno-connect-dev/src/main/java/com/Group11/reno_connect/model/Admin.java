package com.Group11.reno_connect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin") // This will create a separate 'admin' table linked to 'user_account'
public class Admin extends User {

    public Admin() {
        super();
    }

    public Admin(String email, String password) {
        super(email, password);
    }

    // You can add admin-specific fields here in the future if needed
    // For example: String department;
} 