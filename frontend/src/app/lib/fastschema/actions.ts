'use server';

import { activateAccount, login, me, register, resendActivationLink } from '../../../app/lib/fastschema';
import { LoginFormValues, RegisterFormValues } from './schema';
import { cookies } from 'next/headers';

export const getUserInfo = async () => {
  try {
    return await me();
  } catch (e) {
    return null;
  }
};

export const logoutAction = async () => {
  (await cookies()).delete('token');
};

export const loginAction = async (payload: LoginFormValues) => {
  const auth = await login(payload.login, payload.password);
  return auth;
};

export const registerAction = async (payload: RegisterFormValues) => {
  const auth = await register({
    email: payload.email,
    username: payload.username,
    password: payload.password,
    confirm_password: payload.confirm_password
  });
  return auth;
};

export const accountActivationAction = async (token: string) => {
  return activateAccount(token);
}

export const resendActivationLinkAction = async (token: string) => {
  return resendActivationLink(token);
}
