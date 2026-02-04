package com.example.backend.service.impl;

import com.example.backend.Entity.enums.CategoryType;
import com.example.backend.Entity.Category;
import com.example.backend.Entity.User;
import com.example.backend.dto.category.CategoryCreateDTO;
import com.example.backend.dto.category.CategoryResponseDTO;
import com.example.backend.dto.category.CategoryUpdateDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            CategoryMapper categoryMapper
    ) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public CategoryResponseDTO save(String userId, CategoryCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Category category = categoryMapper.toEntity(dto);
        category.setUser(user);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponseDTO(saved);
    }

    @Override
    public CategoryResponseDTO update(String id, CategoryUpdateDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        if (dto.getType() != null) {
            category.setType(dto.getType());
        }
        if (dto.getIcon() != null) {
            category.setIcon(dto.getIcon());
        }
        if (dto.getColor() != null) {
            category.setColor(dto.getColor());
        }
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<CategoryResponseDTO> findById(String id) {
        return categoryRepository.findById(id).map(categoryMapper::toResponseDTO);
    }

    @Override
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public List<CategoryResponseDTO> findByUserId(String userId) {
        return categoryRepository.findByUserId(userId).stream()
                .map(categoryMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<CategoryResponseDTO> findByUserIdAndType(String userId, CategoryType type) {
        return categoryRepository.findByUserIdAndType(userId, type).stream()
                .map(categoryMapper::toResponseDTO)
                .toList();
    }
}
