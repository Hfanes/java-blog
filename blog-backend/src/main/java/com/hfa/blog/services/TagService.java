package com.hfa.blog.services;


import com.hfa.blog.domain.entities.Tag;

import java.util.List;
import java.util.Set;

public interface TagService {
    List<Tag> getTags();
    List<Tag> createTags(Set<String> tagNames);
}
