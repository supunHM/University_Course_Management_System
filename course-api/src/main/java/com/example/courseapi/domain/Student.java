package com.example.courseapi.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", unique = true, nullable = false)
    @NotBlank(message = "Student ID is required")
    private String studentId;
    
    @Column(name = "first_name", nullable = false)
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Column(name = "email", unique = true, nullable = false)
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "year_of_study")
    private Integer yearOfStudy;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StudentStatus status = StudentStatus.ACTIVE;
    
    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;
    
    public enum StudentStatus {
        ACTIVE, INACTIVE, GRADUATED, SUSPENDED
    }
}
