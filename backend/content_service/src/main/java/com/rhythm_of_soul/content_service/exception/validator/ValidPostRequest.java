package com.rhythm_of_soul.content_service.exception.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PostRequestValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPostRequest {
    String message() default "Invalid PostRequest";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
