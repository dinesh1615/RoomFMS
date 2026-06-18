package com.roomfms.controller;

import com.roomfms.dto.*;
import com.roomfms.entity.User;
import com.roomfms.repository.UserRepository;
import com.roomfms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/add-user")
    @PreAuthorize("hasRole('FIN_MGR')")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        return ResponseEntity.ok(authService.addUser(user));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(authService.updateProfile(id, user));
    }
}
