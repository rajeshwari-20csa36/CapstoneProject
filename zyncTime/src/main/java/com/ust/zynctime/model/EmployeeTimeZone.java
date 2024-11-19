package com.ust.zynctime.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeTimeZone {

    @Id
    @Column(nullable = false, unique = true)
    private long employeeId; // Use employeeId as the primary key and foreign key

    @Column(nullable = false)
    private String timeZone;

    @Column(nullable = false)
    private LocalTime workingHoursStart;

    @Column(nullable = false)
    private LocalTime workingHoursEnd;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employeeId", referencedColumnName = "employeeId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"employeeTimeZone"})
    private Employee employee; // Link back to the Employee entity using employeeId as FK
}
