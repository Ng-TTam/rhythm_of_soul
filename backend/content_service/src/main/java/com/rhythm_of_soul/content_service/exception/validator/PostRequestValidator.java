package com.rhythm_of_soul.content_service.exception.validator;

import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.dto.request.PostRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PostRequestValidator implements ConstraintValidator<ValidPostRequest, PostRequest> {

    @Override
    public boolean isValid(PostRequest request, ConstraintValidatorContext context) {
        if (request == null) return true;

        boolean isValid = true;
        context.disableDefaultConstraintViolation();

        if (request.getType() == null) {
            context.buildConstraintViolationWithTemplate("Type must not be null")
                    .addPropertyNode("type")
                    .addConstraintViolation();
            isValid = false;
        } else {
            // 2. If type is TEXT -> caption must not be blank
            if (request.getType() == Type.TEXT) {
                if (request.getCaption() == null || request.getCaption().isBlank()) {
                    context.buildConstraintViolationWithTemplate("Caption must not be blank when type is TEXT")
                            .addPropertyNode("caption")
                            .addConstraintViolation();
                    isValid = false;
                }
            } else {
                // 3. If type is not TEXT -> content must not be null
                if (request.getContent() == null) {
                    context.buildConstraintViolationWithTemplate("Content must not be null when type is not TEXT")
                            .addPropertyNode("content")
                            .addConstraintViolation();
                    isValid = false;
                }
            }
        }

        return isValid;
    }
}
