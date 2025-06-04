package com.hfa.blog.exceptions;

public class RefreshTokenReuseDetectedException extends RuntimeException {
    public RefreshTokenReuseDetectedException(String message) {
        super(message);
    }
}
