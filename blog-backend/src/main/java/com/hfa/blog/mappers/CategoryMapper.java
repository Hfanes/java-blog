package com.hfa.blog.mappers;

import com.hfa.blog.domain.PostStatus;
import com.hfa.blog.domain.dtos.CategoryDto;
import com.hfa.blog.domain.dtos.CreateCategoryRequests;
import com.hfa.blog.domain.entities.Category;
import com.hfa.blog.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

//Generate a Spring bean for this mapper, and don't complain if I don't map every field in the target object.
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    @Mapping(target ="postCount", source="posts", qualifiedByName="calculatePostCount")
    CategoryDto toDto(Category category);
    Category fromDto(CategoryDto categoryDto);

    @Named("calculatePostCount")
    default long calculatePostCount(List<Post> posts) {
        if(null == posts) return 0;
        return posts.stream().filter(post -> PostStatus.PUBLISHED.equals(post.getStatus())).count();
    }

    Category toEntity(CreateCategoryRequests createCategoryRequests);
}
