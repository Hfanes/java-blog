package com.hfa.blog.services;

import com.hfa.blog.domain.entities.User;

import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
}
