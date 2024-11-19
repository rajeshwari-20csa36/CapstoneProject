package com.ust.zynctime.controller;

import com.ust.zynctime.model.Employee;
import com.ust.zynctime.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }


//    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
//    @GetMapping
//    public ResponseEntity<Page<Employee>> getAllEmployees(Pageable pageable) {
//        return ResponseEntity.ok(employeeService.getAllEmployeesPaginated(pageable));
//    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        try {
            Employee newEmployee = employeeService.createEmployee(employee);
            return ResponseEntity.status(HttpStatus.CREATED).body(newEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @PostMapping("/{id}/skills")
    public ResponseEntity<Employee> addSkillToEmployee(@PathVariable Long id, @RequestBody String skill) {
        try {
            Employee updatedEmployee = employeeService.addSkillToEmployee(id, skill);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @DeleteMapping("/{id}/skills")
    public ResponseEntity<Employee> removeSkillFromEmployee(@PathVariable Long id, @RequestBody String skill) {
        try {
            Employee updatedEmployee = employeeService.removeSkillFromEmployee(id, skill);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/search")
    public ResponseEntity<Page<Employee>> searchEmployees(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Set<String> skills,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer numberOfEmployees,
            Pageable pageable) {
        Page<Employee> results = employeeService.findEmployees(searchTerm, skills, location, numberOfEmployees, pageable);
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/skills/{skill}")
    public ResponseEntity<List<Employee>> findEmployeesBySkill(@PathVariable String skill) {
        List<Employee> employees = employeeService.findEmployeesBySkill(skill);
        return ResponseEntity.ok(employees);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @GetMapping("/skills/{skill}/count")
    public ResponseEntity<Long> countEmployeesWithSkill(@PathVariable String skill) {
        long count = employeeService.countEmployeesWithSkill(skill);
        return ResponseEntity.ok(count);
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
//    @GetMapping("/team")
//    public ResponseEntity<List<Employee>> getTeamMembers() {
//        List<Employee> teamMembers = employeeService.getTeamMembers();
//        return ResponseEntity.ok(teamMembers);
//    }
@PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
@PostMapping("/{id}/add-to-team")
public ResponseEntity<Employee> addToTeam(@PathVariable Long id) {
    try {
        Employee updatedEmployee = employeeService.addToTeam(id);
        return ResponseEntity.ok(updatedEmployee);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @PostMapping("/{id}/remove-from-team")
    public ResponseEntity<Employee> removeFromTeam(@PathVariable Long id) {
        try {
            Employee updatedEmployee = employeeService.removeFromTeam(id);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Get all team members
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/team")
    public ResponseEntity<List<Employee>> getTeamMembers() {
        List<Employee> teamMembers = employeeService.getTeamMembers();
        return ResponseEntity.ok(teamMembers);
    }



    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/toggle-team")
    public ResponseEntity<Employee> toggleTeamMembership(@PathVariable Long id) {
        try {
            Employee updatedEmployee = employeeService.toggleTeamMembership(id);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @GetMapping("/skills/distribution")
    public ResponseEntity<Map<String, Long>> getSkillsDistribution() {
        Map<String, Long> distribution = employeeService.getSkillsDistribution();
        return ResponseEntity.ok(distribution);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @GetMapping("/locations/distribution")
    public ResponseEntity<Map<String, Long>> getLocationDistribution() {
        Map<String, Long> distribution = employeeService.getLocationDistribution();
        return ResponseEntity.ok(distribution);
    }

    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> updateEmployeePassword(
            @PathVariable Long id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        try {
            employeeService.updateEmployeePassword(id, oldPassword, newPassword);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/skills")
    public ResponseEntity<List<String>> getAllUniqueSkills() {
        List<String> skills = employeeService.getAllUniqueSkills();
        return ResponseEntity.ok(skills);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER', 'USER')")
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getAllUniqueLocations() {
        List<String> locations = employeeService.getAllUniqueLocations();
        return ResponseEntity.ok(locations);
    }
}