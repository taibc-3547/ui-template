import * as z from 'zod';

export const loginFormSchema = z.object({
  login: z.string().min(1, { message: 'Username or email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const defaultLoginValues: LoginFormValues = {
  login: '',
  password: ''
};

export const registerFormSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirm_password: z.string().min(1, { message: 'Password confirmation is required' })
  })
  .refine((value) => value.password === value.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const defaultRegisterValues: RegisterFormValues = {
  username: '',
  email: '',
  password: '',
  confirm_password: ''
};
