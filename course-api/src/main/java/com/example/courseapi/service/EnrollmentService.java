package com.example.courseapi.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.courseapi.domain.Course;
import com.example.courseapi.domain.Enrollment;
import com.example.courseapi.domain.Student;
import com.example.courseapi.dto.EnrollmentCreateRequest;
import com.example.courseapi.dto.EnrollmentResponse;
import com.example.courseapi.exception.CourseNotFoundException;
import com.example.courseapi.exception.EnrollmentNotFoundException;
import com.example.courseapi.exception.StudentNotFoundException;
import com.example.courseapi.repository.CourseRepository;
import com.example.courseapi.repository.EnrollmentRepository;
import com.example.courseapi.repository.StudentRepository;
import com.example.courseapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EnrollmentService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final StudentService studentService;
    private final CourseService courseService;
    
    public List<EnrollmentResponse> getAllEnrollments() {
        log.info("Fetching all enrollments");
        return enrollmentRepository.findAll()
                .stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }
    
    public EnrollmentResponse getEnrollmentById(Long id) {
        log.info("Fetching enrollment with id: {}", id);
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new EnrollmentNotFoundException("Enrollment not found with id: " + id));
        return mapToEnrollmentResponse(enrollment);
    }
    
    public List<EnrollmentResponse> getEnrollmentsByStudentId(Long studentId) {
        log.info("Fetching enrollments for student id: {}", studentId);
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }
    
    public List<EnrollmentResponse> getEnrollmentsByCourseId(Long courseId) {
        log.info("Fetching enrollments for course id: {}", courseId);
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }
    
    public EnrollmentResponse createEnrollment(EnrollmentCreateRequest request) {
        log.info("Creating new enrollment for student {} in course {}", 
                request.getStudentId(), request.getCourseId());
        
        // Check if student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + request.getStudentId()));
        
        // Check if course exists
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + request.getCourseId()));
        
        // Check if enrollment already exists
        if (enrollmentRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentDate(LocalDateTime.now())
                .semester(request.getSemester())
                .academicYear(request.getAcademicYear())
                .status(Enrollment.EnrollmentStatus.ENROLLED)
                .build();
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Enrollment created successfully with id: {}", savedEnrollment.getId());
        
        return mapToEnrollmentResponse(savedEnrollment);
    }
    
    public EnrollmentResponse updateEnrollmentStatus(Long id, String status) {
        log.info("Updating enrollment status for id: {} to {}", id, status);
        
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new EnrollmentNotFoundException("Enrollment not found with id: " + id));
        
        // Normalize and accept common synonyms from clients
        String normalized = status == null ? "" : status.trim().toUpperCase();
        // replace spaces with underscore to tolerate both "IN PROGRESS" and "IN_PROGRESS"
        normalized = normalized.replace(' ', '_');

        if ("ACTIVE".equals(normalized)) {
            // some clients send ACTIVE when they mean ENROLLED
            normalized = "ENROLLED";
        } else if ("INPROGRESS".equals(normalized) || "IN_PROGRESS".equals(normalized) || "IN-PROGRESS".equals(normalized)) {
            normalized = "IN_PROGRESS";
        }

        try {
            Enrollment.EnrollmentStatus newStatus = Enrollment.EnrollmentStatus.valueOf(normalized);
            enrollment.setStatus(newStatus);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid status: '" + status + "'. Allowed: " + Arrays.toString(Enrollment.EnrollmentStatus.values()));
        }

        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        
        log.info("Enrollment status updated successfully for id: {}", id);
        return mapToEnrollmentResponse(updatedEnrollment);
    }
    
    public void deleteEnrollment(Long id) {
        log.info("Deleting enrollment with id: {}", id);
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new EnrollmentNotFoundException("Enrollment not found with id: " + id));
        
        enrollmentRepository.delete(enrollment);
        log.info("Enrollment deleted successfully with id: {}", id);
    }
    
    public Long getEnrollmentCountByCourse(Long courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }
    
    public Long getEnrollmentCountByStudent(Long studentId) {
        return enrollmentRepository.countByStudentId(studentId);
    }
    
    public EnrollmentResponse selfEnrollment(String username, Long courseId) {
        log.info("Processing self-enrollment for user: {} in course: {}", username, courseId);
        
        // Find the user by username
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        // Find the associated student record using the user's studentId
        if (user.getStudentId() == null) {
            throw new RuntimeException("User is not associated with a student record");
        }
        
        Student student = studentRepository.findByStudentId(user.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException("Student not found with studentId: " + user.getStudentId()));
        
        // Check if course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new RuntimeException("You are already enrolled in this course");
        }
        
        // Create enrollment with current semester and year (you can make these dynamic)
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentDate(LocalDateTime.now())
                .semester("Fall") // TODO: Make this dynamic based on current semester
                .academicYear("2025") // TODO: Make this dynamic based on current academic year
                .status(Enrollment.EnrollmentStatus.ENROLLED)
                .build();
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Self-enrollment successful for user: {} in course: {}", username, courseId);
        
        return mapToEnrollmentResponse(savedEnrollment);
    }
    
    private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .student(studentService.getStudentById(enrollment.getStudent().getId()))
                .course(courseService.getCourseById(enrollment.getCourse().getId()))
                .enrollmentDate(enrollment.getEnrollmentDate())
                .status(enrollment.getStatus().name())
                .semester(enrollment.getSemester())
                .academicYear(enrollment.getAcademicYear())
                .finalGrade(enrollment.getFinalGrade())
                .creditsEarned(enrollment.getCreditsEarned())
                .build();
    }
}
