package com.example.courseapi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.courseapi.domain.Enrollment;
import com.example.courseapi.domain.Grade;
import com.example.courseapi.dto.GradeCreateRequest;
import com.example.courseapi.dto.GradeResponse;
import com.example.courseapi.exception.EnrollmentNotFoundException;
import com.example.courseapi.exception.GradeNotFoundException;
import com.example.courseapi.repository.EnrollmentRepository;
import com.example.courseapi.repository.GradeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GradeService {
    
    private final GradeRepository gradeRepository;
    private final EnrollmentRepository enrollmentRepository;
    
    public List<GradeResponse> getAllGrades() {
        log.info("Fetching all grades");
        return gradeRepository.findAll()
                .stream()
                .map(this::mapToGradeResponse)
                .collect(Collectors.toList());
    }
    
    public GradeResponse getGradeById(Long id) {
        log.info("Fetching grade with id: {}", id);
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException("Grade not found with id: " + id));
        return mapToGradeResponse(grade);
    }
    
    public List<GradeResponse> getGradesByEnrollmentId(Long enrollmentId) {
        log.info("Fetching grades for enrollment id: {}", enrollmentId);
        return gradeRepository.findByEnrollmentId(enrollmentId)
                .stream()
                .map(this::mapToGradeResponse)
                .collect(Collectors.toList());
    }
    
    public List<GradeResponse> getGradesByStudentId(Long studentId) {
        log.info("Fetching grades for student id: {}", studentId);
        return gradeRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToGradeResponse)
                .collect(Collectors.toList());
    }
    
    public List<GradeResponse> getGradesByCourseId(Long courseId) {
        log.info("Fetching grades for course id: {}", courseId);
        return gradeRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToGradeResponse)
                .collect(Collectors.toList());
    }
    
    public GradeResponse createGrade(GradeCreateRequest request) {
        log.info("Creating new grade for enrollment id: {}", request.getEnrollmentId());
        
        Enrollment enrollment = enrollmentRepository.findById(request.getEnrollmentId())
                .orElseThrow(() -> new EnrollmentNotFoundException("Enrollment not found with id: " + request.getEnrollmentId()));
        
        // Calculate percentage
        double percentage = (request.getPointsEarned() / request.getTotalPoints()) * 100;
        
        Grade grade = Grade.builder()
                .enrollment(enrollment)
                .assessmentType(request.getAssessmentType())
                .assessmentName(request.getAssessmentName())
                .pointsEarned(request.getPointsEarned())
                .totalPoints(request.getTotalPoints())
                .percentage(percentage)
                .letterGrade(request.getLetterGrade() != null ? request.getLetterGrade() : calculateLetterGrade(percentage))
                .weight(request.getWeight())
                .assessmentDate(request.getAssessmentDate())
                .gradedDate(LocalDateTime.now())
                .feedback(request.getFeedback())
                .gradedBy(request.getGradedBy())
                .build();
        
        Grade savedGrade = gradeRepository.save(grade);
        log.info("Grade created successfully with id: {}", savedGrade.getId());
        
        return mapToGradeResponse(savedGrade);
    }
    
    public GradeResponse updateGrade(Long id, GradeCreateRequest request) {
        log.info("Updating grade with id: {}", id);
        
        Grade existingGrade = gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException("Grade not found with id: " + id));
        
        // Calculate new percentage
        double percentage = (request.getPointsEarned() / request.getTotalPoints()) * 100;
        
        existingGrade.setAssessmentType(request.getAssessmentType());
        existingGrade.setAssessmentName(request.getAssessmentName());
        existingGrade.setPointsEarned(request.getPointsEarned());
        existingGrade.setTotalPoints(request.getTotalPoints());
        existingGrade.setPercentage(percentage);
        existingGrade.setLetterGrade(request.getLetterGrade() != null ? request.getLetterGrade() : calculateLetterGrade(percentage));
        existingGrade.setWeight(request.getWeight());
        existingGrade.setAssessmentDate(request.getAssessmentDate());
        existingGrade.setFeedback(request.getFeedback());
        existingGrade.setGradedBy(request.getGradedBy());
        existingGrade.setGradedDate(LocalDateTime.now());
        
        Grade updatedGrade = gradeRepository.save(existingGrade);
        log.info("Grade updated successfully with id: {}", id);
        
        return mapToGradeResponse(updatedGrade);
    }
    
    public void deleteGrade(Long id) {
        log.info("Deleting grade with id: {}", id);
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException("Grade not found with id: " + id));
        
        gradeRepository.delete(grade);
        log.info("Grade deleted successfully with id: {}", id);
    }
    
    public Double getAverageGradeByStudent(Long studentId) {
        return gradeRepository.findAverageGradeByStudentId(studentId);
    }
    
    public Double getAverageGradeByCourse(Long courseId) {
        return gradeRepository.findAverageGradeByCourseId(courseId);
    }
    
    private String calculateLetterGrade(double percentage) {
        if (percentage >= 90) return "A";
        else if (percentage >= 80) return "B";
        else if (percentage >= 70) return "C";
        else if (percentage >= 60) return "D";
        else return "F";
    }
    
    private GradeResponse mapToGradeResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .enrollmentId(grade.getEnrollment().getId())
                .studentName(grade.getEnrollment().getStudent().getFirstName() + " " + 
                           grade.getEnrollment().getStudent().getLastName())
                .courseName(grade.getEnrollment().getCourse().getTitle())
                .assessmentType(grade.getAssessmentType())
                .assessmentName(grade.getAssessmentName())
                .pointsEarned(grade.getPointsEarned())
                .totalPoints(grade.getTotalPoints())
                .percentage(grade.getPercentage())
                .letterGrade(grade.getLetterGrade())
                .weight(grade.getWeight())
                .assessmentDate(grade.getAssessmentDate())
                .gradedDate(grade.getGradedDate())
                .feedback(grade.getFeedback())
                .gradedBy(grade.getGradedBy())
                .build();
    }
}
