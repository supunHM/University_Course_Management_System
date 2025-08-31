package com.example.courseapi.dto;

public record CourseResponse(
    Long id,
    String code,
    String title,
    String description,
    Integer credits
) {}
