package com.hfa.blog.mappers;

import com.hfa.blog.domain.dtos.UserDto;
import com.hfa.blog.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserDto toDto(User user);
    User fromDto(UserDto userDto);
}
