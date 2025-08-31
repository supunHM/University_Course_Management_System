package com.example.courseapi.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;
    
    @Column(name = "assessment_type")
    private String assessmentType; // QUIZ, ASSIGNMENT, MIDTERM, FINAL, PROJECT
    
    @Column(name = "assessment_name")
    private String assessmentName;
    
    @Column(name = "points_earned")
    private Double pointsEarned;
    
    @Column(name = "total_points")
    private Double totalPoints;
    
    @Column(name = "percentage")
    private Double percentage;
    
    @Column(name = "letter_grade")
    private String letterGrade;
    
    @Column(name = "weight")
    private Double weight; // Weight of this assessment in final grade calculation
    
    @Column(name = "assessment_date")
    private LocalDateTime assessmentDate;
    
    @Column(name = "graded_date")
    private LocalDateTime gradedDate;
    
    @Column(name = "feedback")
    @Lob
    private String feedback;
    
    @Column(name = "graded_by")
    private String gradedBy; // Instructor/TA name
}
