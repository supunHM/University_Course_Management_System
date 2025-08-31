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

import com.example.courseapi.dto.StudentCreateRequest;
import com.example.courseapi.dto.StudentResponse;
import com.example.courseapi.dto.StudentUpdateRequest;
import com.example.courseapi.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StudentController {
    
    private final StudentService studentService;
    
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        log.info("GET /api/students - Fetching all students");
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        log.info("GET /api/students/{} - Fetching student by id", id);
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
    
    @GetMapping("/student-id/{studentId}")
    public ResponseEntity<StudentResponse> getStudentByStudentId(@PathVariable String studentId) {
        log.info("GET /api/students/student-id/{} - Fetching student by student ID", studentId);
        StudentResponse student = studentService.getStudentByStudentId(studentId);
        return ResponseEntity.ok(student);
    }
    
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        log.info("POST /api/students - Creating new student with student ID: {}", request.getStudentId());
        StudentResponse createdStudent = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(@PathVariable Long id, 
                                                        @Valid @RequestBody StudentUpdateRequest request) {
        log.info("PUT /api/students/{} - Updating student", id);
        StudentResponse updatedStudent = studentService.updateStudent(id, request);
        return ResponseEntity.ok(updatedStudent);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        log.info("DELETE /api/students/{} - Deleting student", id);
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<StudentResponse>> getStudentsByDepartment(@PathVariable String department) {
        log.info("GET /api/students/department/{} - Fetching students by department", department);
        List<StudentResponse> students = studentService.getStudentsByDepartment(department);
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<StudentResponse>> searchStudents(@RequestParam String keyword) {
        log.info("GET /api/students/search?keyword={} - Searching students", keyword);
        List<StudentResponse> students = studentService.searchStudents(keyword);
        return ResponseEntity.ok(students);
    }
}
