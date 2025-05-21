package com.hfa.blog.repositories;

import com.hfa.blog.domain.PostStatus;
import com.hfa.blog.domain.entities.Category;
import com.hfa.blog.domain.entities.Post;
import com.hfa.blog.domain.entities.Tag;
import com.hfa.blog.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    //we need Containing because posts has a collection of tags (multiple tags)
    //but only has 1 category
    List<Post> findAllByStatusAndCategoryAndTagsContaining(PostStatus status, Category category, Tag tag);
    List<Post> findAllByStatusAndCategory(PostStatus status, Category category);
    List<Post> findAllByStatusAndTagsContaining(PostStatus status, Tag tag);
    List<Post> findAllByStatus (PostStatus status);
    List<Post> findAllByAuthorAndStatus (User user, PostStatus status);

}
