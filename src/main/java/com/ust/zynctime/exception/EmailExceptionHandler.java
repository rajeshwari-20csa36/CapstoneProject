package com.ust.zynctime.exception;

import com.ust.zynctime.dto.EmailResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class EmailExceptionHandler {

    @ExceptionHandler(MailException.class)
    public ResponseEntity<EmailResponse> handleMailException(MailException ex) {
        return ResponseEntity
                .internalServerError()
                .body(EmailResponse.error("Failed to send email", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<EmailResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity
                .badRequest()
                .body(EmailResponse.error("Invalid email request", ex.getMessage()));
    }
}