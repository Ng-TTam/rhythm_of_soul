package com.rhythm_of_soul.identity_service.controller;

import com.rhythm_of_soul.identity_service.dto.request.AuthenticationRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserCreatedRequest;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServerAuthController {
    AuthenticationService authenticationService;

//    @GetMapping("/sign-in")
//    public String signIn(Model model) {
//        model.addAttribute("authRequest", new AuthenticationRequest());
//        return "sign_in";
//    }
//
//    @PostMapping("/login")
//    public String login(@Valid @ModelAttribute("authRequest") AuthenticationRequest authRequest,
//                        BindingResult result, Model model) {
//        if (result.hasErrors()) {
//            return "sign-in";
//        }
//
//        try {
//            authenticationService.authenticate(authRequest);
//            return "home";
//        } catch (Exception e) {
//            model.addAttribute("error", e.getMessage());
//            return "sign-in";
//        }
//    }

    @GetMapping("/sign-in")
    public String showSignInForm(Model model) {
        model.addAttribute("authRequest", new AuthenticationRequest());
        return "sign-in";
    }

    @PostMapping("/sign-in")
    public String login(@ModelAttribute("authRequest") AuthenticationRequest authRequest,
                        RedirectAttributes redirectAttributes) {
        try {
            AuthenticationResponse response = authenticationService.authenticate(authRequest);
            // Lưu token nếu cần (hoặc xử lý trong session/cookie)
            redirectAttributes.addFlashAttribute("message", "Đăng nhập thành công");
            return "redirect:/home";
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/sign-in";
        }
    }

    @GetMapping("/sign-up")
    public String showSignUpForm(Model model) {
        model.addAttribute("signUpRequest", new UserCreatedRequest());
        return "sign-up";
    }

    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("user", SecurityContextHolder.getContext().getAuthentication().getName());
        return "home";
    }
}
