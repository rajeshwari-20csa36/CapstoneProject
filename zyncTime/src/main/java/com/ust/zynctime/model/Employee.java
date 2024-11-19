package com.ust.zynctime.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Employee implements UserDetails {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private long id; // Primary key for Employee

    @Column(nullable = false)
    private String UserName;

    @Column(nullable = false)
    private String name;

    @Id
    @Column(nullable = false, unique = true)
    private long employeeId; // Unique employee identifier (useful for the foreign key)

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private String role;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_skills", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    @Column(name = "is_team_member", nullable = false)
    private boolean isTeamMember = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_roles", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    @OneToOne(mappedBy = "employee", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("employee")
    private EmployeeTimeZone employeeTimeZone;


    public Employee(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void addSkill(String skill) {
        this.skills.add(skill);
    }

    public void removeSkill(String skill) {
        this.skills.remove(skill);
    }
}
