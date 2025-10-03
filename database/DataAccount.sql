-- Thêm Roles
INSERT INTO roles (role_name, description)
VALUES 
    ('admin', 'Quản trị hệ thống'),
    ('teacher', 'Giảng viên'),
    ('student', 'Sinh viên');

-- Thêm Users (giả sử password hash = bcrypt('123456'))
INSERT INTO users (email, password_hash, full_name, phone_number, gender, address, email_verified, last_login, updated_at)
VALUES
    ('admin@example.com', '$2b$10$abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'Nguyễn Văn Admin', '0912345678', 'male', 'Hà Nội', true, NOW(), NOW()),
    ('teacher@example.com', '$2b$10$abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'Trần Thị Giáo Viên', '0987654321', 'female', 'HCM', true, NOW(), NOW()),
    ('student@example.com', '$2b$10$abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'Lê Văn Sinh Viên', '0909123123', 'male', 'Đà Nẵng', false, NULL, NOW());

-- Gán Roles cho Users
INSERT INTO user_roles (user_id, role_id, assigned_at)
VALUES
    (1, 1, NOW()), -- admin -> admin
    (2, 2, NOW()), -- teacher -> teacher
    (3, 3, NOW()); -- student -> student

-- Thêm Email Verification token (giả)
INSERT INTO email_verifications (user_id, token, expires_at, verified, created_at)
VALUES
    (3, 'verify_token_123', NOW() + interval '1 day', false, NOW());

-- Thêm Password Reset Token (giả)
INSERT INTO password_reset_tokens (user_id, token, expires_at, used, created_at)
VALUES
    (2, 'reset_token_abc', NOW() + interval '2 hours', false, NOW());
