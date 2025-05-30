package com.hfa.blog.controllers;

import com.hfa.blog.domain.CreatePostRequest;
import com.hfa.blog.domain.UpdatePostRequest;
import com.hfa.blog.domain.dtos.CreatePostRequestDto;
import com.hfa.blog.domain.dtos.PostDto;
import com.hfa.blog.domain.dtos.UpdatePostRequestDto;
import com.hfa.blog.domain.entities.Post;
import com.hfa.blog.domain.entities.User;
import com.hfa.blog.mappers.PostMapper;
import com.hfa.blog.services.PostService;
import com.hfa.blog.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1/posts")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {
    private final PostService postService;
    private final PostMapper postMapper;
    private final UserService userService;

    public PostController(PostService postService, PostMapper postMapper, UserService userService) {
        this.postService = postService;
        this.postMapper = postMapper;
        this.userService = userService;
    }


    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts(
            @RequestParam(required=false) UUID categoryId,
            @RequestParam(required = false) UUID tagId
            )
    {
            List<Post> posts = postService.getAllPosts(categoryId, tagId);
        List<PostDto> postDtos = posts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping(path = "/drafts")
    public ResponseEntity<List<PostDto>> getAllDrafts(@RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        List<Post> draftPosts = postService.getDraftPosts(loggedInUser);
        List<PostDto> postDtos = draftPosts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestAttribute UUID userId, @Valid @RequestBody CreatePostRequestDto createPostRequestDto) {
        User loggedInUser = userService.getUserById(userId);
        CreatePostRequest createPostRequest = postMapper.toCreatePostRequest(createPostRequestDto);
        Post createdPost = postService.createPost(loggedInUser, createPostRequest);
        PostDto postDto = postMapper.toDto(createdPost);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{postId}")
    public ResponseEntity<PostDto> updatePost(@PathVariable UUID postId,
                                              @RequestAttribute UUID userId,
                                              @Valid @RequestBody UpdatePostRequestDto updatePostRequestDto) {
        User user = userService.getUserById(userId);
        UpdatePostRequest updatePostRequest = postMapper.toUpdatePostRequest(updatePostRequestDto);
        Post updatedPost = postService.updatePost(postId, user, updatePostRequest);
        PostDto updatedPostDto = postMapper.toDto(updatedPost);
        return ResponseEntity.ok(updatedPostDto);
    }

    @GetMapping(path = "/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable UUID postId) {
        Post post = postService.getPostById(postId);
        PostDto postDto = postMapper.toDto(post);
        return ResponseEntity.ok(postDto);
    }

    @GetMapping(path = "/my-posts")
    public ResponseEntity<List<PostDto>> getPostsByUser(@RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        List<Post> ownPosts = postService.getUserPosts(loggedInUser);
        List<PostDto> postDtos = ownPosts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @DeleteMapping(path = "/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID postId, @RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        postService.deletePost(postId, user);
        return ResponseEntity.noContent().build();
    }


}
