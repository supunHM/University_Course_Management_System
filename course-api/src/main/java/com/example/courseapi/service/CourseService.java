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

        Course course = new Course();
        course.setCode(request.code());
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setCredits(request.credits());

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

        existingCourse.setCode(request.code());
        existingCourse.setTitle(request.title());
        existingCourse.setDescription(request.description());
        existingCourse.setCredits(request.credits());

        try {
            Course updatedCourse = courseRepository.save(existingCourse);
            return mapToResponse(updatedCourse);
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
