package com.ust.zynctime.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailResponse {
    private String message;
    private boolean success;
    private String errorDetails;

    public static EmailResponse success(String message) {
        return EmailResponse.builder()
                .message(message)
                .success(true)
                .build();
    }

    public static EmailResponse error(String message, String errorDetails) {
        return EmailResponse.builder()
                .message(message)
                .success(false)
                .errorDetails(errorDetails)
                .build();
    }
}
