package com.example.courseapi.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeCreateRequest {
    
    @NotNull(message = "Enrollment ID is required")
    private Long enrollmentId;
    
    @NotNull(message = "Assessment type is required")
    private String assessmentType;
    
    @NotNull(message = "Assessment name is required")
    private String assessmentName;
    
    @NotNull(message = "Points earned is required")
    private Double pointsEarned;
    
    @NotNull(message = "Total points is required")
    private Double totalPoints;
    
    private String letterGrade;
    private Double weight;
    private LocalDateTime assessmentDate;
    private String feedback;
    private String gradedBy;
}
