CREATE DATABASE IF NOT EXISTS react DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE react;

DROP TABLE IF EXISTS sys_role;
CREATE TABLE sys_role (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    permissions VARCHAR(500)
);

DROP TABLE IF EXISTS sys_user;
CREATE TABLE sys_user (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    role_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    avatar VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sys_role (id, name, description, permissions) VALUES 
('1', 'Super Admin', 'Has all permissions', '["all"]'),
('2', 'Editor', 'Can edit content', '["read","write"]'),
('3', 'Viewer', 'Read only access', '["read"]');

INSERT INTO sys_user (id, username, name, role_id, status, created_at) VALUES 
('1', 'admin', 'System Admin', '1', 'active', NOW());
