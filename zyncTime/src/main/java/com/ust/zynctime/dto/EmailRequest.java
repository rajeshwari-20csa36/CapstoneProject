package com.ust.zynctime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EmailRequest {
   @NotBlank(message = "Title cannot be empty")
   private String title;

   @NotBlank(message = "Emails cannot be empty")
   @Pattern(regexp = "^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,6}(\\s*,\\s*[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,6})*$",
           message = "Invalid email format. Use comma-separated email addresses")
   private String emails;

   @NotBlank(message = "Date cannot be empty")
   @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date must be in yyyy-MM-dd format")
   private String date;

   @NotBlank(message = "Time cannot be empty")
   @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Time must be in HH:mm format")
   private String time;

   @NotBlank(message = "Mode cannot be empty")
   private String mode;
}