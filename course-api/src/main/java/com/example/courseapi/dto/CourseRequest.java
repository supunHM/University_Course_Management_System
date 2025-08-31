package com.example.courseapi.dto;

import jakarta.validation.constraints.NotBlank;

public record CourseRequest(
    @NotBlank(message = "Course code is required")
    String code,
    
    @NotBlank(message = "Course title is required")
    String title
) {}