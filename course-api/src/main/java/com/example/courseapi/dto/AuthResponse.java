package com.example.courseapi.dto;

import com.example.courseapi.domain.User.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private String studentId;
}
