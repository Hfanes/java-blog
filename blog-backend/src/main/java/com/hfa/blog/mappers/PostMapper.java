package com.hfa.blog.mappers;

import com.hfa.blog.domain.CreatePostRequest;
import com.hfa.blog.domain.UpdatePostRequest;
import com.hfa.blog.domain.dtos.CreatePostRequestDto;
import com.hfa.blog.domain.dtos.PostDto;
import com.hfa.blog.domain.dtos.UpdatePostRequestDto;
import com.hfa.blog.domain.dtos.UserDto;
import com.hfa.blog.domain.entities.Post;
import com.hfa.blog.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {TagMapper.class, CategoryMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {
    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags") // MapStruct will use TagMapper here automatically now
    @Mapping(target = "status", source = "status")
    PostDto toDto(Post post);
    Post toPost(PostDto postDto);
    CreatePostRequest toCreatePostRequest(CreatePostRequestDto dto);
    UpdatePostRequest toUpdatePostRequest(UpdatePostRequestDto dto);
}
