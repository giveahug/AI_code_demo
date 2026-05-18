package com.example.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.admin.common.Result;
import com.example.admin.entity.User;
import com.example.admin.service.UserService;
import com.example.admin.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        QueryWrapper<User> query = new QueryWrapper<>();
        query.eq("username", username);
        User user = userService.getOne(query);

        if (user != null && "123456".equals(password)) {
            String token = JwtUtils.generateToken(username);
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);
            return Result.success(data);
        }
        return Result.error(400, "Invalid username or password");
    }
}
