package com.hfa.blog.controllers;


import com.hfa.blog.domain.TokensRefreshRequest;
import com.hfa.blog.domain.dtos.*;
import com.hfa.blog.domain.entities.RefreshToken;
import com.hfa.blog.domain.entities.User;
import com.hfa.blog.exceptions.RefreshTokenReuseDetectedException;
import com.hfa.blog.mappers.UserMapper;
import com.hfa.blog.security.BlogUserDetails;
import com.hfa.blog.services.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


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
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse){
        UserDetails userDetails = authenticationService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        String refreshToken = authenticationService.generateRefreshToken(userDetails);
        BlogUserDetails blogUserDetails = (BlogUserDetails) userDetails;
        User user = blogUserDetails.getUser();

        //Save new refreshToken
        authenticationService.saveRefreshToken(refreshToken, user.getId());

        // Set refresh token as HttpOnly cookie
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // True for production
        //this cookie will only be used in this endpoint
        cookie.setPath("/api/v1/auth/refresh");
        cookie.setMaxAge(120); // 2 min
        httpServletResponse.addCookie(cookie);

        AuthorDto authorDto = AuthorDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokenValue)
                .expiresIn(60) //seconds
                .author(authorDto)
                .build();
        return ResponseEntity.ok(authResponse);
    }


    @PostMapping(path = "/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto userDto, HttpServletResponse httpServletResponse) {
        User newUser = authenticationService.register(userMapper.fromDto(userDto));
        UserDetails userDetails = authenticationService.authenticate(userDto.getEmail(), userDto.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        String refreshToken = authenticationService.generateRefreshToken(userDetails);

        //save refreshToken on db
        authenticationService.saveRefreshToken(refreshToken, newUser.getId() );

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // True for production
        //this cookie will only be used in this endpoint
        cookie.setPath("/api/v1/auth/refresh");
        cookie.setMaxAge(120); //2 min
        httpServletResponse.addCookie(cookie);

        AuthorDto authorDto = AuthorDto.builder()
                .id(newUser.getId())
                .email(newUser.getEmail())
                .name(newUser.getName())
                .build();
        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokenValue)
                .expiresIn(60) //1min
                .author(authorDto)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(path = "/refresh")
    public ResponseEntity<AuthResponse> refreshAccessToken(
            @CookieValue(name = "refreshToken", required = false) String refreshTokenValue,
            HttpServletResponse httpServletResponse
    ) {
        System.out.println("refreshTokenValue controller" + refreshTokenValue);
        TokensRefreshRequest tokensRefreshRequest = authenticationService.refreshToken(refreshTokenValue);

        // Set new refresh token in cookie
        Cookie cookie = new Cookie("refreshToken",tokensRefreshRequest.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // in production, use HTTPS
        cookie.setPath("/api/v1/auth/refresh");
        cookie.setMaxAge(120); // 2 min
        httpServletResponse.addCookie(cookie);

        AuthorDto authorDto = AuthorDto.builder()
                .id(tokensRefreshRequest.getUser().getId())
                .email(tokensRefreshRequest.getUser().getEmail())
                .name(tokensRefreshRequest.getUser().getName())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .jwtToken(tokensRefreshRequest.getAccessToken())
                .expiresIn(60)
                .author(authorDto)
                .build();

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshTokenValue,
            HttpServletResponse response) {

        if (refreshTokenValue != null) {
            authenticationService.logout(refreshTokenValue);
        }

        // Clear the refresh token cookie
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // use HTTPS in production
        cookie.setPath("/api/v1/auth/logout");
        cookie.setMaxAge(0); // Delete cookie immediately
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }


    @GetMapping(path = "/{userId}")
    public ResponseEntity<GetUserDto> getUserByEmail(@PathVariable UUID userId) {
        User User = authenticationService.getUserById(userId);
        GetUserDto getUserDto = userMapper.toGetUserDto(User);
        return ResponseEntity.ok(getUserDto);
    }
}
