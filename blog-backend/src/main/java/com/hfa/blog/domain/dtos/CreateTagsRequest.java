package com.hfa.blog.domain.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTagsRequest {
    @NotEmpty(message="At least one tage name is required")
    @Size(max = 10, message = "Maximun {max} tags allowed")
    private Set<
            //to each tag
            @Size(min=2, max=30, message="Tag name must be between {min} and {max} characters")
            @Pattern(regexp = "^[\\w\\s-]+$", message = "Tag name only contain letters, numbers, spaces and hyphens")
            String> names;
}
