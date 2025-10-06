export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateRegisterInput(input: RegisterInput) {
  const { full_name, email, password, confirmPassword } = input;

  // Họ tên: 3–50 ký tự, chỉ chữ cái (có dấu) và khoảng trắng
  const nameRegex = /^[\p{L}\s]{3,50}$/u;

  // Email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Mật khẩu: ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?_&]{8,}$/;

  if (!full_name || !full_name.trim()) {
    return "Họ và tên là bắt buộc.";
  }
  if (!nameRegex.test(full_name)) {
    return "Họ và tên chỉ được chứa chữ cái, khoảng trắng và có độ dài từ 3–50 ký tự.";
  }

  if (!email || !email.trim()) {
    return "Email là bắt buộc.";
  }
  if (!emailRegex.test(email)) {
    return "Email không hợp lệ.";
  }

  if (!password) {
    return "Mật khẩu là bắt buộc.";
  }
  if (!passwordRegex.test(password)) {
    return "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
  }
  if (/\s/.test(password)) {
    return "Mật khẩu không được chứa khoảng trắng.";
  }

  if (!confirmPassword) {
    return "Xác nhận mật khẩu là bắt buộc.";
  }
  if (confirmPassword !== password) {
    return "Mật khẩu xác nhận không khớp.";
  }

  return null; // ✅ hợp lệ
}
