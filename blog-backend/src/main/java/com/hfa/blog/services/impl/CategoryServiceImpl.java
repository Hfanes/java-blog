package com.hfa.blog.services.impl;


import com.hfa.blog.domain.entities.Category;
import com.hfa.blog.repositories.CategoryRepository;
import com.hfa.blog.services.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

}
