package com.ust.zynctime.security.dto;

import java.util.Set;

public record RegisterRequest(
        String UserName,
        Long employeeId,
        String name,
        String email,
        String password,
        String location,
        String designation,
        String role,
        Set<String> skills,
        Set<String> roles
) {

}