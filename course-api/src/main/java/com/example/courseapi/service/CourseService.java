package com.example.courseapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.courseapi.domain.Course;
import com.example.courseapi.dto.CourseCreateRequest;
import com.example.courseapi.dto.CourseResponse;
import com.example.courseapi.dto.CourseUpdateRequest;
import com.example.courseapi.exception.CourseCodeAlreadyExistsException;
import com.example.courseapi.exception.CourseNotFoundException;
import com.example.courseapi.repository.CourseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
        return mapToResponse(course);
    }

    @Transactional
    public CourseResponse createCourse(CourseCreateRequest request) {
        if (courseRepository.existsByCode(request.code())) {
            throw new CourseCodeAlreadyExistsException("Course with code '" + request.code() + "' already exists");
        }

        Course course = Course.builder()
                .code(request.code())
                .title(request.title())
                .description(request.description())
                .credits(request.credits())
                .build();

        try {
            Course savedCourse = courseRepository.save(course);
            return mapToResponse(savedCourse);
        } catch (DataIntegrityViolationException e) {
            throw new CourseCodeAlreadyExistsException("Course with code '" + request.code() + "' already exists");
        }
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseUpdateRequest request) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));

        if (courseRepository.existsByCodeAndIdNot(request.code(), id)) {
            throw new CourseCodeAlreadyExistsException("Course with code '" + request.code() + "' already exists");
        }

        // Create new course with updated values using builder
        Course updatedCourse = Course.builder()
                .id(existingCourse.getId())
                .code(request.code())
                .title(request.title())
                .description(request.description())
                .credits(request.credits())
                .build();

        try {
            Course savedCourse = courseRepository.save(updatedCourse);
            return mapToResponse(savedCourse);
        } catch (DataIntegrityViolationException e) {
            throw new CourseCodeAlreadyExistsException("Course with code '" + request.code() + "' already exists");
        }
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new CourseNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    private CourseResponse mapToResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getCode(),
                course.getTitle(),
                course.getDescription(),
                course.getCredits()
        );
    }
}
