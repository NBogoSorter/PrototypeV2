package com.Group11.reno_connect.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Group11.reno_connect.model.HomeOwner;
import com.Group11.reno_connect.service.HomeOwnerService;

//import com.example.demo.model.User;
import java.util.List;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private HomeOwnerService homeOwnerService;

    @PostMapping
    public HomeOwner createHomeOwner(@RequestBody HomeOwner homeOwner) {
        return homeOwnerService.createHomeOwner(homeOwner);
    }

    @GetMapping
    public List<HomeOwner> getAllHomeOwners() {
        return homeOwnerService.getAllHomeOwners();
    }
}