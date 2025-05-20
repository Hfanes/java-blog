package com.hfa.blog.controllers;


import com.hfa.blog.domain.dtos.CreateTagsRequest;
import com.hfa.blog.domain.dtos.TagResponse;
import com.hfa.blog.domain.entities.Tag;
import com.hfa.blog.mappers.TagMapper;
import com.hfa.blog.services.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<List<TagResponse>> createTags(@RequestBody @Valid CreateTagsRequest createTagsRequest) {
        List<Tag> savedTags = tagService.createTags(createTagsRequest.getNames());
        List<TagResponse> createdTagResponses = savedTags.stream().map(tagMapper::toTagResponse).toList();
        // If all requested tags already existed, no new tags created → return 200 OK
        boolean allTagsAlreadyExisted = savedTags.size() == createTagsRequest.getNames().size();

        HttpStatus status = allTagsAlreadyExisted ? HttpStatus.OK : HttpStatus.CREATED;
        return new ResponseEntity<>(createdTagResponses, status);
    }

    @DeleteMapping(path="/{tagId}")
    public ResponseEntity<Void> deleteTags(@PathVariable UUID tagId){
        tagService.deleteTag(tagId);
        return ResponseEntity.noContent().build();
    }
}
