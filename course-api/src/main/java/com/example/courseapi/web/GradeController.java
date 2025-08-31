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
import org.springframework.web.bind.annotation.RestController;

import com.example.courseapi.dto.GradeCreateRequest;
import com.example.courseapi.dto.GradeResponse;
import com.example.courseapi.service.GradeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class GradeController {
    
    private final GradeService gradeService;
    
    @GetMapping
    public ResponseEntity<List<GradeResponse>> getAllGrades() {
        log.info("GET /api/grades - Fetching all grades");
        List<GradeResponse> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GradeResponse> getGradeById(@PathVariable Long id) {
        log.info("GET /api/grades/{} - Fetching grade by id", id);
        GradeResponse grade = gradeService.getGradeById(id);
        return ResponseEntity.ok(grade);
    }
    
    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<GradeResponse>> getGradesByEnrollmentId(@PathVariable Long enrollmentId) {
        log.info("GET /api/grades/enrollment/{} - Fetching grades by enrollment id", enrollmentId);
        List<GradeResponse> grades = gradeService.getGradesByEnrollmentId(enrollmentId);
        return ResponseEntity.ok(grades);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeResponse>> getGradesByStudentId(@PathVariable Long studentId) {
        log.info("GET /api/grades/student/{} - Fetching grades by student id", studentId);
        List<GradeResponse> grades = gradeService.getGradesByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<GradeResponse>> getGradesByCourseId(@PathVariable Long courseId) {
        log.info("GET /api/grades/course/{} - Fetching grades by course id", courseId);
        List<GradeResponse> grades = gradeService.getGradesByCourseId(courseId);
        return ResponseEntity.ok(grades);
    }
    
    @PostMapping
    public ResponseEntity<GradeResponse> createGrade(@Valid @RequestBody GradeCreateRequest request) {
        log.info("POST /api/grades - Creating new grade for enrollment {}", request.getEnrollmentId());
        GradeResponse createdGrade = gradeService.createGrade(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGrade);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GradeResponse> updateGrade(@PathVariable Long id, 
                                                   @Valid @RequestBody GradeCreateRequest request) {
        log.info("PUT /api/grades/{} - Updating grade", id);
        GradeResponse updatedGrade = gradeService.updateGrade(id, request);
        return ResponseEntity.ok(updatedGrade);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        log.info("DELETE /api/grades/{} - Deleting grade", id);
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/average/student/{studentId}")
    public ResponseEntity<Double> getAverageGradeByStudent(@PathVariable Long studentId) {
        log.info("GET /api/grades/average/student/{} - Getting average grade for student", studentId);
        Double average = gradeService.getAverageGradeByStudent(studentId);
        return ResponseEntity.ok(average);
    }
    
    @GetMapping("/average/course/{courseId}")
    public ResponseEntity<Double> getAverageGradeByCourse(@PathVariable Long courseId) {
        log.info("GET /api/grades/average/course/{} - Getting average grade for course", courseId);
        Double average = gradeService.getAverageGradeByCourse(courseId);
        return ResponseEntity.ok(average);
    }
}
