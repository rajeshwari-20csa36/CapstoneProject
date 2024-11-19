package com.ust.zynctime.controller;

import com.ust.zynctime.dto.EmailResponse;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ust.zynctime.dto.EmailRequest;


import lombok.extern.slf4j.Slf4j;



@Slf4j
@RestController
@RequestMapping("/api/timezone/email")
@Validated
@CrossOrigin
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;


    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")  // Restrict to admin and organizer roles
    @PostMapping("/send")
    public ResponseEntity<EmailResponse> sendEmail(@Valid @RequestBody EmailRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            log.debug("User roles: {}", auth.getAuthorities());
            String[] emailAddresses = request.getEmails().split(",");

            for (String email : emailAddresses) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("rajirajeshwar552@gmail.com");
                message.setTo(email.trim());
                message.setSubject(request.getTitle());
                message.setText(String.format("""
                Date: %s
                Time: %s
                Mode: %s""",
                        request.getDate(),
                        request.getTime(),
                        request.getMode()));
                mailSender.send(message);

            }
            return ResponseEntity.ok(EmailResponse.success("Emails sent successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(EmailResponse.error("Failed to send emails", e.getMessage()));
        }
    }


}