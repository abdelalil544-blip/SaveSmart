package com.example.backend.mapper;

import com.example.backend.Entity.RefreshToken;
import com.example.backend.dto.refreshtoken.RefreshTokenCreateDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RefreshTokenMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    RefreshToken toEntity(RefreshTokenCreateDTO dto);

    @Mapping(target = "userId", expression = "java(entity.getUser() != null ? entity.getUser().getId() : null)")
    RefreshTokenResponseDTO toResponseDTO(RefreshToken entity);
}
