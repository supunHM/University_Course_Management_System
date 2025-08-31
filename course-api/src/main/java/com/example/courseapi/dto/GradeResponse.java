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
public class GradeResponse {
    
    private Long id;
    private Long enrollmentId;
    private String studentName;
    private String courseName;
    private String assessmentType;
    private String assessmentName;
    private Double pointsEarned;
    private Double totalPoints;
    private Double percentage;
    private String letterGrade;
    private Double weight;
    private LocalDateTime assessmentDate;
    private LocalDateTime gradedDate;
    private String feedback;
    private String gradedBy;
}
