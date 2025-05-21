package com.hfa.blog.services;


import com.hfa.blog.domain.entities.Tag;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagService {
    List<Tag> getTags();
    List<Tag> createTags(Set<String> tagNames);
    void deleteTag(UUID tagId);
    Tag getTagById(UUID tagId);
    List<Tag> getTagByIds(Set<UUID> tagIds);
}
