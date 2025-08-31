package com.example.courseapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CourseCreateRequest(
    @NotBlank(message = "Course code is required") 
    String code,
    
    @NotBlank(message = "Course title is required") 
    String title,
    
    String description,
    
    @Min(value = 1, message = "Credits must be at least 1")
    Integer credits
) {}
