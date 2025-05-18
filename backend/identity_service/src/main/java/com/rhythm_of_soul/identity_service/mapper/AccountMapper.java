package com.rhythm_of_soul.identity_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.rhythm_of_soul.identity_service.dto.response.AccountResponse;
import com.rhythm_of_soul.identity_service.entity.Account;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(
            target = "fullName",
            expression =
                    "java(account.getUser() != null ? account.getUser().getFirstName() + \" \" + account.getUser().getLastName() : \"\")")
    @Mapping(target = "avatar", expression = "java(account.getUser() != null ? account.getUser().getAvatar() : \"\")")
    AccountResponse toAccountResponse(Account account);
}
