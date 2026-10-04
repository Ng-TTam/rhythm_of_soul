package com.rhythm_of_soul.application.exception;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.request.PostRequest;
import com.rhythm_of_soul.domain.model.enums.Type;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PostRequestValidator implements ConstraintValidator<ValidPostRequest, PostRequest> {

    @Override
    public boolean isValid(PostRequest request, ConstraintValidatorContext context) {
        if (request == null) return true;

        boolean isValid = true;
        context.disableDefaultConstraintViolation();

        if (request.getType() == null) {
            addViolation(context, "type", "Type must not be null");
            return false;
        }

        switch (request.getType()) {
            case TEXT:
                if (isBlank(request.getCaption())) {
                    addViolation(context, "caption", "Caption must not be blank when type is TEXT");
                    isValid = false;
                }
                break;

            case SONG:
                if (request.getContent() == null) {
                    addViolation(context, "content", "Content must not be null when type is SONG");
                    return false;
                }
                isValid = validateSongContent(request.getContent(), context);
                break;

            case ALBUM:
            case PLAYLIST:
                if (request.getContent() == null) {
                    addViolation(context, "content", "Content must not be null when type is " + request.getType());
                    return false;
                }
                isValid = validateAlbumOrPlaylistContent(request.getContent(), context);
                break;

            case REPOST:
                if (request.getContent() == null) {
                    addViolation(context, "content", "Content must not be null when type is REPOST");
                    return false;
                }
                isValid = validateRepostContent(request.getContent(), context);
                break;
        }

        return isValid;
    }

    private boolean validateSongContent(ContentRequest content, ConstraintValidatorContext context) {
        boolean isValid = true;
        if (isBlank(content.getTitle())) {
            addViolation(context, "content.title", "Title must not be blank when type is SONG");
            isValid = false;
        }
        if (isBlank(content.getMediaUrl())) {
            addViolation(context, "content.mediaUrl", "Media URL must not be blank when type is SONG");
            isValid = false;
        }
        return isValid;
    }

    private boolean validateAlbumOrPlaylistContent(ContentRequest content, ConstraintValidatorContext context) {
        boolean isValid = true;
        if (isBlank(content.getTitle())) {
            addViolation(context, "content.title", "Title must not be blank when type is ALBUM or PLAYLIST");
            isValid = false;
        }
        return isValid;
    }

    private boolean validateRepostContent(ContentRequest content, ConstraintValidatorContext context) {
        boolean isValid = true;
        if (isBlank(content.getOriginalPostId())) {
            addViolation(context, "content.originalPostId", "Original post ID must not be blank when type is REPOST");
            isValid = false;
        }
        return isValid;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private void addViolation(ConstraintValidatorContext context, String property, String message) {
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(property)
                .addConstraintViolation();
    }
}
