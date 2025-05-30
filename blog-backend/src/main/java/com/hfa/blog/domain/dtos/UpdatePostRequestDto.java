package com.hfa.blog.domain.dtos;

import com.hfa.blog.domain.PostStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePostRequestDto {
//    @NotNull(message = "Post ID is required")
//    private UUID postId;

    @NotNull(message = "Title is required")
    @Size(min=3, max=200, message = "Title must be between {min} and {max} characters")
    private String title;

    @NotNull(message = "Content is required")
    @Size(min=3, max=50000, message = "Content must be between {min} and {max} characters")
    private String content;

    @NotNull(message = "Category Id is required")
    private UUID categoryId;

    //if no tags default is empty set
    @Builder.Default
    @Size(max=10, message = "Maximun {max} tags allowed")
    private Set<UUID> tagIds = new HashSet<>();

    @NotNull(message = "Status is required")
    private PostStatus status;

}
