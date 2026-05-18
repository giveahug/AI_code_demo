package com.example.admin.controller;

import com.example.admin.common.Result;
import com.example.admin.entity.Role;
import com.example.admin.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @GetMapping
    public Result<List<Role>> list() {
        List<Role> list = roleService.list();
        return Result.success(list, (long) list.size());
    }

    @PostMapping
    public Result<Role> add(@RequestBody Role role) {
        roleService.save(role);
        return Result.success(role);
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable String id, @RequestBody Role role) {
        role.setId(id);
        roleService.updateById(role);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable String id) {
        roleService.removeById(id);
        return Result.success(null);
    }
}
