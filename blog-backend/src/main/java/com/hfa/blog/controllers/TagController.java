package com.hfa.blog.controllers;


import com.hfa.blog.domain.dtos.CreateTagsRequest;
import com.hfa.blog.domain.dtos.TagResponse;
import com.hfa.blog.domain.entities.Tag;
import com.hfa.blog.mappers.TagMapper;
import com.hfa.blog.services.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="api/v1/tags")
public class TagController {

    private final TagService tagService;
    private final TagMapper tagMapper;

    public TagController(TagService tagService, TagMapper tagMapper) {
        this.tagService = tagService;
        this.tagMapper = tagMapper;
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags(){
        List<TagResponse> tags = tagService.getTags()
                .stream()
                .map(tagMapper::toTagResponse)
                .toList();
                ;
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<List<TagResponse>> createTags(@RequestBody CreateTagsRequest createTagsRequest) {

    }
}
