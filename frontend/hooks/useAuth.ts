import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authApi, LoginRequest, RegisterRequest, VerifyEmailRequest } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLogin, user, setCredentials, logout: logoutStore } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      if (data.skipOTP && data.user) {
        setCredentials(data.user);
        toast.success(data.message);
        // Redirect dựa vào role
        const role = data.user.role.toLowerCase();
        if (role === 'student') {
          router.push('/student');
        } else if (role === 'lecturer' || role === 'teacher') {
          router.push('/teacher');
        } else if (role === 'admin') {
          router.push('/admin');
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    },
  });

  // Register Student mutation
  const registerStudentMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.registerStudent(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    },
  });

  // Register Lecturer mutation
  const registerLecturerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.registerLecturer(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    },
  });

  // Verify Email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: (data) => {
      setCredentials(data.user);
      toast.success(data.message);
      // Redirect dựa vào role
      const role = data.user.role.toLowerCase();
      if (role === 'student') {
        router.push('/student');
      } else if (role === 'lecturer' || role === 'teacher') {
        router.push('/teacher');
      } else if (role === 'admin') {
        router.push('/admin');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xác thực thất bại');
    },
  });

  // Resend OTP mutation
  const resendOTPMutation = useMutation({
    mutationFn: (email: string) => authApi.resendOTP(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gửi OTP thất bại');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      router.push('/login');
      toast.success('Đăng xuất thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng xuất thất bại');
    },
  });

  return {
    // State
    isLogin,
    user,
    
    // Mutations
    login: loginMutation.mutate,
    registerStudent: registerStudentMutation.mutate,
    registerLecturer: registerLecturerMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    resendOTP: resendOTPMutation.mutate,
    logout: logoutMutation.mutate,
    
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerStudentMutation.isPending || registerLecturerMutation.isPending,
    isVerifying: verifyEmailMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}










