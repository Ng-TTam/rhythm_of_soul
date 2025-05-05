package com.rhythm_of_soul.identity_service.service.impl;

import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.PageResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.mapper.UserMapper;
import com.rhythm_of_soul.identity_service.repository.UserRepository;
import com.rhythm_of_soul.identity_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    @Override
    @PreAuthorize("hasRole('ADMIN') or accountSecurity.isProfileOwner(#userId)")
    public UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        //user cannot update artist field if not artist role
        if(Boolean.TRUE.equals(user.getIsArtist()))
            userMapper.updateArtist(user, userUpdateRequest);
        else
            userMapper.updateUser(user, userUpdateRequest);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = userRepository.findAll(pageable);
        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(userMapper::toUserResponse).toList())
                .build();
    }
}
