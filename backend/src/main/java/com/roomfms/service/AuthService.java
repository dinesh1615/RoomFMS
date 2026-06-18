package com.roomfms.service;

import com.roomfms.dto.LoginRequest;
import com.roomfms.dto.JwtResponse;
import com.roomfms.entity.User;
import com.roomfms.enums.Role;
import com.roomfms.repository.UserRepository;
import com.roomfms.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getMobile(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken((UserDetails) authentication.getPrincipal());
        
        User user = userRepository.findByMobile(loginRequest.getMobile()).get();
        
        return JwtResponse.builder()
                .token(jwt)
                .id(user.getId())
                .name(user.getName())
                .mobile(user.getMobile())
                .role(user.getRole().name())
                .build();
    }

    public User addUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateProfile(Long userId, User userDetails) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setMobile(userDetails.getMobile());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(userDetails.getPassword()));
        }
        if (userDetails.getProfilePhoto() != null) {
            user.setProfilePhoto(userDetails.getProfilePhoto());
        }
        return userRepository.save(user);
    }
}
