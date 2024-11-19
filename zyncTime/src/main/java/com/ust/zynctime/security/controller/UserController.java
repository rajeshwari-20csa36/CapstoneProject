package com.ust.zynctime.security.controller;


import com.ust.zynctime.model.Employee;
import com.ust.zynctime.repo.EmployeeRepository;

import com.ust.zynctime.security.dto.LoginRequest;
import com.ust.zynctime.security.dto.RegisterRequest;
import com.ust.zynctime.security.service.ApiUserService;
import com.ust.zynctime.security.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class UserController {

    private final EmployeeRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ApiUserService apiUserService;
    private final AuthenticationManager authenticationManager;
    private final MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter;

    @PostMapping("/register")
    public ResponseEntity<Employee> register(@RequestBody RegisterRequest request) {
        var user = new Employee();
        user.setUserName(request.UserName());
        user.setEmployeeId(request.employeeId());
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setLocation(request.location());
        user.setDesignation(request.designation());
        user.setRole(request.role());
user.setSkills(request.skills());
        // Add ROLE_ prefix to each role if not already present
        Set<String> roles = request.roles().stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .collect(Collectors.toSet());
        user.setRoles(roles);

        user.setTeamMember(false); // Default value, can be changed later if needed

        var response = userRepository.save(user);
        return ResponseEntity.ok(response);
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<Map<?,?>> login(@RequestBody LoginRequest request) {
        log.debug("Login request: {}", request);

        Map<Object,Object> response = new HashMap<>();
        response.put("token", "");
        response.put("authenticated", false);

        Authentication authRequest = UsernamePasswordAuthenticationToken
                .unauthenticated(request.email(), request.password());
        Authentication authResult = authenticationManager.authenticate(authRequest);
        log.debug("Auth result: {}", authResult);
        if (authResult.isAuthenticated()) {
            UserDetails user = apiUserService.loadUserByUsername(request.email());
            log.info("User: {}", request.email());
            log.info("User: {}", user.getUsername());
            response.put("token", jwtService.generateToken(user));
            response.put("authenticated", true);
        }
        response.put("status", HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        log.error("Error: ", e);
        return ResponseEntity.badRequest().body(e.getMessage());
    }

}

