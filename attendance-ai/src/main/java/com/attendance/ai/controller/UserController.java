package com.attendance.ai.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.attendance.ai.model.User;
import com.attendance.ai.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173") // React connection
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Admin creates a new student/user
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {

        System.out.println("✅ ADD USER API HIT");

        // Ensure role is always set
        user.setRole("STUDENT");

        User savedUser = userService.saveUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // ✅ Login API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        System.out.println("✅ LOGIN API HIT");

        String email = credentials.get("email");
        String password = credentials.get("password");

        // Basic validation
        if (email == null || password == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Email and Password are required");
        }

        User user = userService.loginUser(email, password);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }

    // ✅ Get all users (Admin Dashboard)
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {

        System.out.println("✅ GET ALL USERS API HIT");

        List<User> users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    // ✅ Test API (for debugging connection)
    @GetMapping("/test")
    public String test() {
        return "✅ UserController Working";
    }
}