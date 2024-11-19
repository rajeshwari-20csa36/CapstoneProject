package com.ust.zynctime.model;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-generated ID for EmployeeTimeZone

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", unique = true)  // Foreign key mapping to Employee id
    private Employee employee;  // The actual foreign key to the Employee entity

    @Column(nullable = false)
    private String timeZone;

    @Column(nullable = false)
    private LocalTime workingHoursStart;

    @Column(nullable = false)
    private LocalTime workingHoursEnd;
}
