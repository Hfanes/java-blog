package com.hfa.blog.repositories;

import com.hfa.blog.domain.entities.RefreshToken;
import com.hfa.blog.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    void deleteAllByUser(User user);
    //use optional because its singly entity
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
}
