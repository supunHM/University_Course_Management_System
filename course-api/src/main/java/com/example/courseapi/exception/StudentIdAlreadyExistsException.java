package com.example.courseapi.exception;

public class StudentIdAlreadyExistsException extends RuntimeException {
    public StudentIdAlreadyExistsException(String message) {
        super(message);
    }
}
