package com.hfa.blog.controllers;


import com.hfa.blog.domain.dtos.*;
import com.hfa.blog.domain.entities.User;
import com.hfa.blog.mappers.UserMapper;
import com.hfa.blog.security.BlogUserDetails;
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
        BlogUserDetails blogUserDetails = (BlogUserDetails) userDetails;
        User user = blogUserDetails.getUser();

        AuthorDto authorDto = AuthorDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokenValue)
                .expiresIn(86400)
                .author(authorDto)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(path = "/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto userDto) {
        User newUser = authenticationService.register(userMapper.fromDto(userDto));
        UserDetails userDetails = authenticationService.authenticate(userDto.getEmail(), userDto.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthorDto authorDto = AuthorDto.builder()
                .id(newUser.getId())
                .email(newUser.getEmail())
                .name(newUser.getName())
                .build();
        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokenValue)
                .expiresIn(86400)
                .author(authorDto)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping(path = "/{userId}")
    public ResponseEntity<GetUserDto> getUserByEmail(@PathVariable UUID userId) {
        User User = authenticationService.getUserById(userId);
        GetUserDto getUserDto = userMapper.toGetUserDto(User);
        return ResponseEntity.ok(getUserDto);
    }
}
