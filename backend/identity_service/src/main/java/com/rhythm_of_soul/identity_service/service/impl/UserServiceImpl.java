package com.rhythm_of_soul.identity_service.service.impl;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.rhythm_of_soul.identity_service.constant.ArtistProfileStatus;
import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserUpdateRequest;
import com.rhythm_of_soul.identity_service.dto.response.PageResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.ArtistProfile;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.mapper.ArtistProfileMapper;
import com.rhythm_of_soul.identity_service.mapper.UserMapper;
import com.rhythm_of_soul.identity_service.repository.AccountRepository;
import com.rhythm_of_soul.identity_service.repository.UserRepository;
import com.rhythm_of_soul.identity_service.service.UserService;
import com.rhythm_of_soul.identity_service.utils.JwtUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    AccountRepository accountRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    JwtUtils jwtUtil;
    ArtistProfileMapper artistProfileMapper;

    @Override
    @PreAuthorize("@userSecurity.isProfileOwner(#userId) or hasRole('ADMIN')")
    public UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // user cannot update artist field if not artist role
        if (user.isArtist()) {
            if (userUpdateRequest.getArtistProfile() == null) throw new AppException(ErrorCode.BLANK_ARTIST_PROFILE);
            if (userUpdateRequest.getArtistProfile().getStageName() == null)
                throw new AppException(ErrorCode.BLANK_STAGE_NAME);

            userMapper.updateArtist(user, userUpdateRequest);
        } else userMapper.updateUser(user, userUpdateRequest);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        User user = userRepository
                .findByAccountEmail(email + "@gmail.com")
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
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
                .data(pageData.getContent().stream()
                        .map(userMapper::toUserResponse)
                        .toList())
                .build();
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')") // Role Artist can not assign role artist
    public void assignRoleArtist(ArtistProfileRequest artistProfileRequest) {
        Account account = accountRepository
                .findById(jwtUtil.getAccountInContext())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // User verified can upgrade artist
        if (!account.isVerified()) throw new AppException(ErrorCode.ACCOUNT_NOT_VERIFIED);

        // set is_artist = true in user
        User user = userRepository.findByAccountId(account.getId()).orElseThrow();

        // create artist profile, if account have artist profile is null else update
        ArtistProfile artistProfile = null;
        if (user.getArtistProfile() == null) {
            artistProfile = artistProfileMapper.toArtistProfile(artistProfileRequest);
            artistProfile.setUser(user);
            artistProfile.setStatus(ArtistProfileStatus.PENDING);
            user.setArtistProfile(artistProfile);
        } else {
            artistProfile = user.getArtistProfile();
            artistProfileMapper.updateArtistProfile(artistProfile, artistProfileRequest);
            user.setArtistProfile(artistProfile);
        }
        userRepository.save(user);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void upgradeRoleArtist(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Account account =
                accountRepository.findByUser(user).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // save change of artist profile status and user is_artist
        ArtistProfile artistProfile = user.getArtistProfile();
        artistProfile.setStatus(ArtistProfileStatus.APPROVED);
        user.setArtist(true);

        userRepository.save(user);

        // save change account
        account.setRole(Role.ARTIST);
        accountRepository.save(account);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void revokeRoleArtist(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // save change of artist profile status is rejected
        ArtistProfile artistProfile = user.getArtistProfile();
        artistProfile.setStatus(ArtistProfileStatus.REJECTED);

        userRepository.save(user);
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(int page, int size, String searchKey) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> userPage;

        if (searchKey == null || searchKey.trim().isEmpty()) {
            userPage = userRepository.findAll(pageRequest);
        } else {
            userPage = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                    searchKey, searchKey, pageRequest
            );
        }

        return PageResponse.<UserResponse>builder()
                .currentPage(userPage.getNumber())
                .totalPages(userPage.getTotalPages())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .data(userPage.getContent()
                        .stream()
                        .map(userMapper::toUserResponse)
                        .collect(Collectors.toList()))
                .build();
    }

}
