package com.rhythm_of_soul.identity_service.mapper;

import com.rhythm_of_soul.identity_service.constant.Role;
import org.mapstruct.Mapper;

import com.rhythm_of_soul.identity_service.dto.request.UserCreatedRequest;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public interface UserMapper {
    default UserResponse toUserResponse(User user) {

        return UserResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .verify_email(user.isVerify())
                .role(user.getRole())
                .build();
    }

    default User toUser(UserCreatedRequest userRequest) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        return User.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(Role.USER)
                .isVerify(false)
                .build();
    }
}
