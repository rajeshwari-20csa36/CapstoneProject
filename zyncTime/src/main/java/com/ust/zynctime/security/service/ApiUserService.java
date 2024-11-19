package com.ust.zynctime.security.service;


import com.ust.zynctime.repo.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApiUserService implements UserDetailsService {

    private final EmployeeRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var dbUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User
                .builder()
                .username(dbUser.getUsername())
                .password(dbUser.getPassword())
                .authorities(dbUser.getAuthorities())
                .build();
    }
    public boolean hasRole(String username, String role) {
        // Here, we can fetch the user from the database by email/username and check their roles
        // Assuming you have an Employee entity with roles stored in a collection or a role string
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if the user has the specified role
        return userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + role));
    }

}
