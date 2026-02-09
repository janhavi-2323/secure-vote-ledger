package com.example.securevoteledger.controller;

import com.example.securevoteledger.dto.*;
import com.example.securevoteledger.entity.User;
import com.example.securevoteledger.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {
        userService.register(
                req.getUsername(),
                req.getPassword(),
                req.getRole() != null ? req.getRole() : "VOTER"
        );
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userService.login(req.getUsername(), req.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        Map<String, String> res = new HashMap<>();
        res.put("token", "dummy-jwt");
        res.put("username", user.getUsername());
        res.put("role", user.getRole());

        return ResponseEntity.ok(res);
    }
}
