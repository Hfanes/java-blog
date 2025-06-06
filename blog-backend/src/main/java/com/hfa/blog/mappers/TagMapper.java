package com.hfa.blog.mappers;

import com.hfa.blog.domain.PostStatus;
import com.hfa.blog.domain.dtos.TagResponse;
import com.hfa.blog.domain.entities.Post;
import com.hfa.blog.domain.entities.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper {
    @Mapping(target="postCount", source = "posts", qualifiedByName = "calculatePostCount")
    TagResponse toTagResponse(Tag tag);
    Tag fromTagResponse(TagResponse tagResponse);

    @Named("calculatePostCount")
    default Integer calculatePostCount(Set<Post> posts) {
        if(posts == null) return 0;
        return (int) posts.stream().filter(
                post -> PostStatus.PUBLISHED.equals(post.getStatus()))
                        .count();

    }
}

