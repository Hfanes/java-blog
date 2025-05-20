package com.hfa.blog.services.impl;

import com.hfa.blog.domain.entities.Tag;
import com.hfa.blog.repositories.TagRepository;
import com.hfa.blog.services.TagService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
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

    @Transactional
    @Override
    public List<Tag> createTags(Set<String> tagNames) {
        //existing tags from the database
        //list of Tag objects (like Tag("java"), Tag("spring"), etc.)
        List<Tag> existingTags = tagRepository.findByNameIn(tagNames);
        System.out.println("TEST" + existingTags);
        //Extracts tag names from those Tag objects into a Set
        Set<String> existingTagNames = existingTags.stream().map(Tag::getName).collect(Collectors.toSet());
        System.out.println(existingTagNames);
        List<Tag> newTags = tagNames.stream().filter(name -> !existingTagNames.contains(name))
                .map(name -> Tag.builder()
                        .name(name)
                        .posts(new HashSet<>())
                        .build())
                .toList();

        List<Tag> savedTags = new ArrayList<>();
        if(!newTags.isEmpty()) {
            savedTags = tagRepository.saveAll(newTags);
        }
        savedTags.addAll(existingTags);
        return savedTags;
    }

    @Override
    public void deleteTag(UUID tagId) {
        tagRepository.findById(tagId).ifPresent(tag -> {
            if(!tag.getPosts().isEmpty()) {
                throw new IllegalArgumentException("Cannot delete tag with posts");
            }
            tagRepository.deleteById(tagId);
        });
    }
}
