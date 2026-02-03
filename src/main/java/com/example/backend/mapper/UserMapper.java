package com.example.backend.mapper;

import com.example.backend.Entity.User;
import com.example.backend.dto.user.UserCreateDTO;
import com.example.backend.dto.user.UserResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "incomes", ignore = true)
    @Mapping(target = "expenses", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "savingGoals", ignore = true)
    User toEntity(UserCreateDTO dto);

    UserResponseDTO toResponseDTO(User entity);
}
