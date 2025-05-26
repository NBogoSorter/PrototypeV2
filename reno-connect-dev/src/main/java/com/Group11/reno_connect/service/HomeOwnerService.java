package com.Group11.reno_connect.service;

import java.util.List;

import com.Group11.reno_connect.model.HomeOwner;

import org.springframework.stereotype.Service;

import com.Group11.reno_connect.repository.HomeOwnerRepository;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class HomeOwnerService {

    @Autowired
    private HomeOwnerRepository homeOwnerRepository;

    public HomeOwner createHomeOwner(HomeOwner homeOwner) {
        return homeOwnerRepository.save(homeOwner);
    }

    public List<HomeOwner> getAllHomeOwners() {
        return homeOwnerRepository.findAll();
    }


}
