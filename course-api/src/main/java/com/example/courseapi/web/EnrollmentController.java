package com.example.courseapi.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.courseapi.dto.EnrollmentCreateRequest;
import com.example.courseapi.dto.EnrollmentResponse;
import com.example.courseapi.service.EnrollmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EnrollmentController {
    
    private final EnrollmentService enrollmentService;
    
    @GetMapping
    public ResponseEntity<List<EnrollmentResponse>> getAllEnrollments() {
        log.info("GET /api/enrollments - Fetching all enrollments");
        List<EnrollmentResponse> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable Long id) {
        log.info("GET /api/enrollments/{} - Fetching enrollment by id", id);
        EnrollmentResponse enrollment = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(enrollment);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudentId(@PathVariable Long studentId) {
        log.info("GET /api/enrollments/student/{} - Fetching enrollments by student id", studentId);
        List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByCourseId(@PathVariable Long courseId) {
        log.info("GET /api/enrollments/course/{} - Fetching enrollments by course id", courseId);
        List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);
        return ResponseEntity.ok(enrollments);
    }
    
    @PostMapping
    public ResponseEntity<EnrollmentResponse> createEnrollment(@Valid @RequestBody EnrollmentCreateRequest request) {
        log.info("POST /api/enrollments - Creating new enrollment for student {} in course {}", 
                request.getStudentId(), request.getCourseId());
        EnrollmentResponse createdEnrollment = enrollmentService.createEnrollment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEnrollment);
    }
    
    @PostMapping("/self-enroll/{courseId}")
    public ResponseEntity<EnrollmentResponse> selfEnroll(@PathVariable Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        log.info("POST /api/enrollments/self-enroll/{} - Student {} self-enrolling in course", courseId, username);
        EnrollmentResponse enrollment = enrollmentService.selfEnrollment(username, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<EnrollmentResponse> updateEnrollmentStatus(@PathVariable Long id, 
                                                                   @RequestParam String status) {
        log.info("PUT /api/enrollments/{}/status - Updating enrollment status to {}", id, status);
        EnrollmentResponse updatedEnrollment = enrollmentService.updateEnrollmentStatus(id, status);
        return ResponseEntity.ok(updatedEnrollment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        log.info("DELETE /api/enrollments/{} - Deleting enrollment", id);
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/count/course/{courseId}")
    public ResponseEntity<Long> getEnrollmentCountByCourse(@PathVariable Long courseId) {
        log.info("GET /api/enrollments/count/course/{} - Getting enrollment count for course", courseId);
        Long count = enrollmentService.getEnrollmentCountByCourse(courseId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/student/{studentId}")
    public ResponseEntity<Long> getEnrollmentCountByStudent(@PathVariable Long studentId) {
        log.info("GET /api/enrollments/count/student/{} - Getting enrollment count for student", studentId);
        Long count = enrollmentService.getEnrollmentCountByStudent(studentId);
        return ResponseEntity.ok(count);
    }
}
