package com.hfa.blog.services.impl;

import com.hfa.blog.domain.TokensRefreshRequest;
import com.hfa.blog.domain.entities.RefreshToken;
import com.hfa.blog.domain.entities.User;
import com.hfa.blog.exceptions.RefreshTokenExpiredException;
import com.hfa.blog.exceptions.RefreshTokenReuseDetectedException;
import com.hfa.blog.repositories.RefreshTokenRepository;
import com.hfa.blog.repositories.UserRepository;
import com.hfa.blog.services.AuthenticationService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Long accessExpiresMs = 60000L; //milliseconds 60000L
    private final Long refreshExpiresMs = 120000L; //milliseconds 120000L
    private final RefreshTokenRepository refreshTokenRepository;


    //This gets the secret key from application.properties or application.yml under jwt.secret. It’s used to sign the JWT so it can be trusted.
    @Value("${jwt.secret}")
    private String secretKey;

    public AuthenticationServiceImpl(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, UserRepository userRepository, PasswordEncoder passwordEncoder, RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    @Override
    public UserDetails authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        return userDetailsService.loadUserByUsername(email);
    }

    @Override
    @Transactional
    public User register(User user) {
        System.out.println(user);
        if(user.getEmail()==null || user.getPassword()==null)
        {
            throw new IllegalArgumentException("User must have a password and email");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists with email: " + user.getEmail());
        }
        User newUser = User.builder()
                .name(user.getName())
                .email(user.getEmail())
                .password(passwordEncoder.encode(user.getPassword()))
                .build();
        return userRepository.save(newUser);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessExpiresMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiresMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //Converts the string secret key into a cryptographic key for signing the JWT.
    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public UserDetails validateToken(String token) {
        String username = extractUsername(token);
        return userDetailsService.loadUserByUsername(username);
    }

    @Override
    @Transactional
    public void saveRefreshToken(String token, UUID userId) {
        User user = getUserById(userId);
        RefreshToken existingToken = refreshTokenRepository.findByUser(user).orElseThrow(() -> new EntityNotFoundException("refreshToken not found"));

        existingToken.setToken(token);
        existingToken.setExpiryDate(LocalDateTime.now().plusSeconds(refreshExpiresMs / 1000));

        refreshTokenRepository.save(existingToken);
    }

    @Transactional
    @Override
    public void deleteRefreshTokensByUser(User user) {
        refreshTokenRepository.deleteAllByUser(user);
    }

    @Override
    @Transactional
    public TokensRefreshRequest refreshToken(String refreshTokenValue) {
        System.out.println("refreshTokenValue service" + refreshTokenValue);

        RefreshToken existingRefreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                //Token alreaddy used, doesn't exist, deleted
                .orElseThrow(() -> new RefreshTokenReuseDetectedException("Token reuse detected or invalid"));

        //Token expired, user must login
        if (existingRefreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(existingRefreshToken); // clear previous one
            throw new RefreshTokenExpiredException("Refresh token expired");
        }

        User user = existingRefreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = generateToken(userDetails);
        String newRefreshTokenValue = generateRefreshToken(userDetails);

        existingRefreshToken.setToken(newRefreshTokenValue);
        existingRefreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(refreshExpiresMs / 1000));

        refreshTokenRepository.save(existingRefreshToken);

        TokensRefreshRequest tokensRefreshRequest = TokensRefreshRequest.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenValue)
                .user(user)
                .build();

        return tokensRefreshRequest;
    }

    @Transactional
    @Override
    public void logout(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                //Token reuse or invalid
                .orElseThrow(() -> new RefreshTokenReuseDetectedException("Token reuse detected or invalid"));
        refreshTokenRepository.deleteById(refreshToken.getId());
    }

    @Override
    public User getUserById(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return user;
    }

    private String extractUsername(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
