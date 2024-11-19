package com.ust.zynctime.repo;

import com.ust.zynctime.model.EmployeeTimeZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




@Repository
public interface EmployeeTimeZoneRepository extends JpaRepository<EmployeeTimeZone, Long> {



}