package com.hfa.blog.services;


import com.hfa.blog.domain.CreatePostRequest;
import com.hfa.blog.domain.UpdatePostRequest;
import com.hfa.blog.domain.entities.Post;
import com.hfa.blog.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);
    List<Post> getUserPosts(User user);

    Post createPost(User user, CreatePostRequest createPostRequest);
    Post updatePost(UUID postId, User user, UpdatePostRequest updatePostRequest);
    Post getPostById(UUID postId);
    void deletePost(UUID postId, User user);
}
