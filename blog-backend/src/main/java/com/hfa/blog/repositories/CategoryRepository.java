package com.hfa.blog.repositories;

import com.hfa.blog.domain.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    //to fetch both categories and posts
    //with findAll we only fetch categories, and then if we want the posts
    //we would need to do fetch posts for each category
    //JPA/Hibernate keeps track of your data in memory during a request, in something called the persistence context (or first-level cache).
    //If something is “not loaded,” JPA will go ask the database.
    //If it’s already “loaded” (because you used JOIN FETCH), JPA just gives it to you from memory.
    //This all happens within the same transaction/session (usually one HTTP request).
    //LEFT JOIN: All rows from left and all from right that matches left If there’s no match, still include the left row.
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.posts")
    List<Category> findAllWithPostCount();

    boolean existsByNameIgnoreCase(String name);
}
