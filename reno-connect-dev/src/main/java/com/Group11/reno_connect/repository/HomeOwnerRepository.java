package com.Group11.reno_connect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Group11.reno_connect.model.HomeOwner;

@Repository
public interface HomeOwnerRepository extends JpaRepository<HomeOwner, Long> {
    HomeOwner findByEmail(String email);
}


