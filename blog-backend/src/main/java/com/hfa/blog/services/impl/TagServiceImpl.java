package com.hfa.blog.services.impl;

import com.hfa.blog.domain.entities.Tag;
import com.hfa.blog.repositories.TagRepository;
import com.hfa.blog.services.TagService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {
    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public List<Tag> getTags() {
        return tagRepository.findAllWithPostCount();
    }
    @Override
    public List<Tag> createTags(Set<String> tagNames) {
        List<Tag> existingTags = tagRepository.findByNameIn(tagNames);
        existingTags.stream()
    }
}
