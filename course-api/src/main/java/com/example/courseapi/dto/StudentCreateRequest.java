package com.example.courseapi.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCreateRequest {
    
    @NotBlank(message = "Student ID is required")
    private String studentId;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String phoneNumber;
    
    private LocalDate dateOfBirth;
    
    private String address;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotNull(message = "Year of study is required")
    private Integer yearOfStudy;
    
    private LocalDate enrollmentDate;
}
