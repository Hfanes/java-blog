package com.hfa.blog.services;

import com.hfa.blog.domain.TokensRefreshRequest;
import com.hfa.blog.domain.entities.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface AuthenticationService {
    UserDetails authenticate(String username, String password);
    String generateToken(UserDetails userDetails);

    String generateRefreshToken(UserDetails userDetails);

    UserDetails validateToken(String token);
    User register(User user);

    void saveRefreshToken(String token, UUID userId);

    User getUserById(UUID userId);

    void deleteRefreshTokensByUser(User user);

    TokensRefreshRequest refreshToken(String refreshTokenValue);

    void logout(String refreshTokenValue);
}
