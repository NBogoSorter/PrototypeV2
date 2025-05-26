package com.Group11.reno_connect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.Group11.reno_connect.model.ServiceModel;
import com.Group11.reno_connect.dto.ServiceSearchDTO;
import com.Group11.reno_connect.dto.ServiceDetailDTO;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceModel, Long> {
    List<ServiceModel> findByServiceProviderId(Long providerId);
    Optional<ServiceModel> findByIdAndServiceProviderId(Long id, Long providerId);
    
    // Debug query to see all services in the database
    @Query(value = "SELECT * FROM service", nativeQuery = true)
    List<ServiceModel> findAllServices();
    
    // Debug query to see services for a specific provider
    @Query(value = "SELECT * FROM service WHERE service_provider_id = :providerId", nativeQuery = true)
    List<ServiceModel> findAllServicesByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT new com.Group11.reno_connect.dto.ServiceSearchDTO(" +
           "s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.serviceProvider.email, " +
           "COALESCE(AVG(r.rating), 2.5), s.serviceProvider.id, s.duration, s.isSponsored) " +
           "FROM ServiceModel s " +
           "LEFT JOIN s.reviews r " +
           "GROUP BY s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.serviceProvider.email, s.serviceProvider.id, s.duration, s.isSponsored")
    List<ServiceSearchDTO> findAllServicesForSearch();
    
    @Query("SELECT new com.Group11.reno_connect.dto.ServiceSearchDTO(" +
           "s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.serviceProvider.email, " +
           "COALESCE(AVG(r.rating), 2.5), s.serviceProvider.id, s.duration, s.isSponsored) " +
           "FROM ServiceModel s " +
           "LEFT JOIN s.reviews r " +
           "WHERE (LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.type) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "GROUP BY s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.serviceProvider.email, s.serviceProvider.id, s.duration, s.isSponsored")
    List<ServiceSearchDTO> searchServices(@Param("searchTerm") String searchTerm);

    @Query("SELECT new com.Group11.reno_connect.dto.ServiceDetailDTO(" +
           "s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.duration, COALESCE(AVG(r.rating), 2.5)) " +
           "FROM ServiceModel s LEFT JOIN s.reviews r WHERE s.id = :serviceId " +
           "GROUP BY s.id, s.name, s.description, s.type, s.price, s.location, s.serviceProvider.businessName, s.duration")
    Optional<ServiceDetailDTO> findServiceDetailById(@Param("serviceId") Long serviceId);

    @Query("SELECT new com.Group11.reno_connect.dto.ServiceSearchDTO(" +
           "s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.serviceProvider.email, " +
           "COALESCE(AVG(r.rating), 2.5), s.serviceProvider.id, s.duration, s.isSponsored) " +
           "FROM ServiceModel s " +
           "LEFT JOIN s.reviews r " +
           "WHERE s.serviceProvider.id = :providerId " +
           "GROUP BY s.id, s.name, s.description, s.type, s.price, s.location, " +
           "s.serviceProvider.businessName, s.serviceProvider.email, s.serviceProvider.id, s.duration, s.isSponsored")
    List<ServiceSearchDTO> findByServiceProviderIdForSearch(@Param("providerId") Long providerId);
}
