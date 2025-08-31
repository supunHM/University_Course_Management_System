package com.example.courseapi.service;

public class CourseCodeAlreadyExistsException extends RuntimeException {
    public CourseCodeAlreadyExistsException(String message) {
        super(message);
    }
}
