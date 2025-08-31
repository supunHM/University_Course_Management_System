package com.example.courseapi.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {
    
    private String firstName;
    private String lastName;
    
    @Email(message = "Valid email is required")
    private String email;
    
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;
    private String department;
    private Integer yearOfStudy;
    private String status;
}
