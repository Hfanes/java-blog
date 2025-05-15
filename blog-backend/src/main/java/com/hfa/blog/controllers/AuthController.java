package com.hfa.blog.controllers;


import com.hfa.blog.domain.dtos.AuthResponse;
import com.hfa.blog.domain.dtos.LoginRequest;
import com.hfa.blog.domain.dtos.UserDto;
import com.hfa.blog.domain.entities.User;
import com.hfa.blog.mappers.UserMapper;
import com.hfa.blog.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/auth")
public class AuthController {
    private final AuthenticationService authenticationService;
    private final UserMapper userMapper;

    public AuthController(AuthenticationService authenticationService, UserMapper userMapper) {
        this.authenticationService = authenticationService;
        this.userMapper = userMapper;
    }

    @PostMapping(path="/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokenValue)
                .expiresIn(86400)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(path = "/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto userDto) {
        User newUser = authenticationService.register(userMapper.fromDto(userDto));
        UserDetails userDetails = authenticationService.authenticate(userDto.getEmail(), userDto.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokenValue)
                .expiresIn(86400)
                .build();
        return ResponseEntity.ok(authResponse);
    }
}
