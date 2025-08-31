package com.example.courseapi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    
    private Long id;
    private StudentResponse student;
    private CourseResponse course;
    private LocalDateTime enrollmentDate;
    private String status;
    private String semester;
    private String academicYear;
    private String finalGrade;
    private Integer creditsEarned;
}
