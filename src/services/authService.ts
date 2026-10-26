import { api, getServerMessage } from '../api/client';
import { User } from '../types';

export type AuthResult = { token: string; user: User; expiresAt: number };
type AuthResponse = { accessToken: string; user: User & { password?: string } };

// Đọc "exp" (giây) trong payload JWT
function getJwtExpiry(token: string): number {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)).exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000;
  }
}

// Không giữ mật khẩu (dù đã băm) trong app
const toPublicUser = ({ password, ...user }: User & { password?: string }): User => user;

const toResult = (data: AuthResponse): AuthResult => ({
  token: data.accessToken,
  user: toPublicUser(data.user),
  expiresAt: getJwtExpiry(data.accessToken),
});

const MESSAGES: Record<string, string> = {
  'Cannot find user': 'Email hoặc mật khẩu không đúng',
  'Incorrect password': 'Email hoặc mật khẩu không đúng',
  'Email already exists': 'Email đã được sử dụng',
  'Email format is invalid': 'Email không đúng định dạng',
  'Password is too short': 'Mật khẩu quá ngắn',
};

const toAppError = (err: unknown) => {
  const msg = getServerMessage(err);
  if (msg) return new Error(MESSAGES[msg] ?? msg);
  return new Error('Không kết nối được máy chủ. Kiểm tra json-server và địa chỉ IP');
};

async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await api.post<AuthResponse>('/login', { email: email.trim(), password });
    return toResult(res.data);
  } catch (err) {
    throw toAppError(err);
  }
}

async function register(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    const res = await api.post<AuthResponse>('/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    return toResult(res.data);
  } catch (err) {
    throw toAppError(err);
  }
}

// Xác minh token khi auto-login (route /users là 600)
async function getMe(userId: number): Promise<User> {
  const res = await api.get<User & { password?: string }>(`/users/${userId}`);
  return toPublicUser(res.data);
}

export default { login, register, getMe };