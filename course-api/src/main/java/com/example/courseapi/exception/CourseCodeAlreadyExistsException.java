package com.example.courseapi.exception;

public class CourseCodeAlreadyExistsException extends RuntimeException {
    public CourseCodeAlreadyExistsException(String message) {
        super(message);
    }
}
