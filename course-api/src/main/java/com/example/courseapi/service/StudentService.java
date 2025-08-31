package com.example.courseapi.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.courseapi.domain.Student;
import com.example.courseapi.dto.StudentCreateRequest;
import com.example.courseapi.dto.StudentResponse;
import com.example.courseapi.dto.StudentUpdateRequest;
import com.example.courseapi.exception.StudentIdAlreadyExistsException;
import com.example.courseapi.exception.StudentNotFoundException;
import com.example.courseapi.repository.StudentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentService {
    
    private final StudentRepository studentRepository;
    
    public List<StudentResponse> getAllStudents() {
        log.info("Fetching all students");
        return studentRepository.findAll()
                .stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }
    
    public StudentResponse getStudentById(Long id) {
        log.info("Fetching student with id: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        return mapToStudentResponse(student);
    }
    
    public StudentResponse getStudentByStudentId(String studentId) {
        log.info("Fetching student with student ID: {}", studentId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with student ID: " + studentId));
        return mapToStudentResponse(student);
    }
    
    public StudentResponse createStudent(StudentCreateRequest request) {
        log.info("Creating new student with student ID: {}", request.getStudentId());
        
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new StudentIdAlreadyExistsException("Student ID already exists: " + request.getStudentId());
        }
        
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new StudentIdAlreadyExistsException("Email already exists: " + request.getEmail());
        }
        
        Student student = Student.builder()
                .studentId(request.getStudentId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .department(request.getDepartment())
                .yearOfStudy(request.getYearOfStudy())
                .enrollmentDate(request.getEnrollmentDate() != null ? request.getEnrollmentDate() : LocalDate.now())
                .status(Student.StudentStatus.ACTIVE)
                .build();
        
        Student savedStudent = studentRepository.save(student);
        log.info("Student created successfully with id: {}", savedStudent.getId());
        
        return mapToStudentResponse(savedStudent);
    }
    
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        log.info("Updating student with id: {}", id);
        
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        
        if (request.getEmail() != null && !request.getEmail().equals(existingStudent.getEmail())) {
            if (studentRepository.existsByEmail(request.getEmail())) {
                throw new StudentIdAlreadyExistsException("Email already exists: " + request.getEmail());
            }
        }
        
        updateStudentFields(existingStudent, request);
        Student updatedStudent = studentRepository.save(existingStudent);
        
        log.info("Student updated successfully with id: {}", updatedStudent.getId());
        return mapToStudentResponse(updatedStudent);
    }
    
    public void deleteStudent(Long id) {
        log.info("Deleting student with id: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        
        studentRepository.delete(student);
        log.info("Student deleted successfully with id: {}", id);
    }
    
    public List<StudentResponse> getStudentsByDepartment(String department) {
        log.info("Fetching students by department: {}", department);
        return studentRepository.findByDepartment(department)
                .stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> searchStudents(String keyword) {
        log.info("Searching students with keyword: {}", keyword);
        return studentRepository.findByKeyword(keyword)
                .stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }
    
    private void updateStudentFields(Student student, StudentUpdateRequest request) {
        if (request.getFirstName() != null) {
            student.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            student.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            student.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            student.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getDateOfBirth() != null) {
            student.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getDepartment() != null) {
            student.setDepartment(request.getDepartment());
        }
        if (request.getYearOfStudy() != null) {
            student.setYearOfStudy(request.getYearOfStudy());
        }
        if (request.getStatus() != null) {
            student.setStatus(Student.StudentStatus.valueOf(request.getStatus()));
        }
    }
    
    private StudentResponse mapToStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .department(student.getDepartment())
                .yearOfStudy(student.getYearOfStudy())
                .status(student.getStatus().name())
                .enrollmentDate(student.getEnrollmentDate())
                .build();
    }
}
