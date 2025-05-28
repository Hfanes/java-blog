package com.hfa.blog.services.impl;


import com.hfa.blog.domain.UpdatePostRequest;
import com.hfa.blog.domain.entities.Category;
import com.hfa.blog.domain.entities.Post;
import com.hfa.blog.domain.entities.Tag;
import com.hfa.blog.repositories.CategoryRepository;
import com.hfa.blog.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service

public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCount();
    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        if(categoryRepository.existsByNameIgnoreCase(category.getName())){
            throw new IllegalArgumentException("Category name already exists: " + category.getName());
        }
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategoryById(UUID categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if(category.isPresent()){
            if(!category.get().getPosts().isEmpty()){
                throw new IllegalStateException("Category has posts associated with this id: " + categoryId);
            }
            categoryRepository.deleteById(categoryId);
        }
    }

    @Override
    public Category getCategoryById(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
    }

    @Override
    @Transactional
    public Category updateCategory(UUID categoryId, Category categoryToUpdate) {
        if(categoryToUpdate.getId() == null)
        {
            throw new IllegalArgumentException("Category does not have an ID");
        }
        if (!categoryId.equals(categoryToUpdate.getId()))
        {
            throw new IllegalArgumentException("Attempting to change Category id, this is not permitted");
        }
        if(categoryToUpdate.getName() == null)
        {
            throw new IllegalArgumentException("Category name is empty");
        }
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setName(categoryToUpdate.getName());

        return categoryRepository.save(existingCategory);
    }

}
