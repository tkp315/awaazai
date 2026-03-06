import { z } from 'zod';

export const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type TSignupForm = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type TLoginForm = z.infer<typeof loginSchema>;

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type TSendOtpForm = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits'),
});

export type TVerifyOtpForm = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type TResetPasswordForm = z.infer<typeof resetPasswordSchema>;
