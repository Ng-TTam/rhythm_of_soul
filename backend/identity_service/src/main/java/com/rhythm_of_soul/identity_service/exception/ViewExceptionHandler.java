package com.rhythm_of_soul.identity_service.exception;

import com.rhythm_of_soul.identity_service.dto.request.AuthenticationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.file.AccessDeniedException;

@Slf4j
@ControllerAdvice(basePackages = "com.rhythm_of_soul.identity_service.controller")
public class ViewExceptionHandler {
    @ExceptionHandler(value = Exception.class)
    public String handlingRuntimeException(Exception exception, RedirectAttributes redirectAttributes) {
        log.error("Exception: ", exception);
        redirectAttributes.addFlashAttribute("error", exception.getMessage());
        return "redirect:/sign-in";
    }

    @ExceptionHandler(value = AppException.class)
    public String handlingAppException(AppException exception, RedirectAttributes redirectAttributes) {
        ErrorCode errorCode = exception.getErrorCode();
        redirectAttributes.addFlashAttribute("error", errorCode.getMessage());
        String redirectUrl = errorCode == ErrorCode.USER_EXISTED ? "/sign-up" : "/sign-in";
        return "redirect:" + redirectUrl;
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public String handlingAccessDeniedException(AccessDeniedException exception, RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("error", ErrorCode.UNAUTHORIZED.getMessage());
        return "redirect:/sign-in";
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public String handlingValidation(MethodArgumentNotValidException exception, RedirectAttributes redirectAttributes) {
        String errorMessage = exception.getFieldError().getDefaultMessage();
        redirectAttributes.addFlashAttribute("error", errorMessage);
        String redirectUrl = exception.getBindingResult().getTarget() instanceof AuthenticationRequest ? "/sign-in" : "/sign-up";
        return "redirect:" + redirectUrl;
    }
}
