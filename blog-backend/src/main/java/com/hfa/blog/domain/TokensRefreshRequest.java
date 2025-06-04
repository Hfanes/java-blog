package com.hfa.blog.domain;


import com.hfa.blog.domain.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokensRefreshRequest {
    private String accessToken;
    private String refreshToken;
    private User user;
}
