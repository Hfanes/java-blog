package com.hfa.blog.services;

import com.hfa.blog.domain.entities.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface AuthenticationService {
    UserDetails authenticate(String username, String password);
    String generateToken(UserDetails userDetails);
    UserDetails validateToken(String token);
    User register(User user);
    User getUserById(UUID userId);
}
