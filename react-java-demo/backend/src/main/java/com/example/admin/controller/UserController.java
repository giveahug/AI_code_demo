package com.example.admin.controller;

import com.example.admin.common.Result;
import com.example.admin.entity.User;
import com.example.admin.service.UserService;
import com.example.admin.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/currentUser")
    public Result<User> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (JwtUtils.validateToken(token)) {
                String username = JwtUtils.getUsernameFromToken(token);
                User user = userService.query().eq("username", username).one();
                return Result.success(user);
            }
        }
        return Result.error(401, "Unauthorized");
    }

    @GetMapping("/users")
    public Result<List<User>> list() {
        List<User> list = userService.list();
        return Result.success(list, (long) list.size());
    }

    @PostMapping("/users")
    public Result<User> add(@RequestBody User user) {
        user.setCreatedAt(LocalDateTime.now());
        userService.save(user);
        return Result.success(user);
    }

    @PutMapping("/users/{id}")
    public Result<Void> update(@PathVariable String id, @RequestBody User user) {
        user.setId(id);
        userService.updateById(user);
        return Result.success(null);
    }

    @DeleteMapping("/users/{id}")
    public Result<Void> delete(@PathVariable String id) {
        userService.removeById(id);
        return Result.success(null);
    }
}
