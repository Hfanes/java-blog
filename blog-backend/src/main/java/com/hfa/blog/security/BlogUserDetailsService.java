package com.hfa.blog.security;

import com.hfa.blog.domain.entities.User;
import com.hfa.blog.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


public class BlogUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public BlogUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    //this will thorw a BadCredentialsException
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       User user =  userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
       return new BlogUserDetails(user);
    }
}
