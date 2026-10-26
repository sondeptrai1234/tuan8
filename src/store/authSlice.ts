import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { AuthResult } from '../services/authService';
import { setAuthToken } from '../api/client';
import { User } from '../types';

export const AUTH_STORAGE_KEY = 'bookstore_auth';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  restoring: boolean; // đang kiểm tra phiên cũ khi mở app
};

const initialState: AuthState = { user: null, token: null, isLoggedIn: false, restoring: true };

// Lưu token + user (KHÔNG lưu mật khẩu) vào AsyncStorage
const persist = async (r: AuthResult) => {
  setAuthToken(r.token);
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(r));
};

export const login = createAsyncThunk<
  AuthResult,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const r = await authService.login(email, password);
    await persist(r);
    return r;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const register = createAsyncThunk<
  AuthResult,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const r = await authService.register(name, email, password);
    await persist(r);
    return r;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  setAuthToken(null);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
});

// Auto-login: đọc AsyncStorage khi mở app, rồi xác minh token với server
export const restoreSession = createAsyncThunk<AuthResult | null>('auth/restore', async () => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const saved: AuthResult = JSON.parse(raw);
    const isValid = !!saved.token && !!saved.user?.id && saved.expiresAt > Date.now();
    if (!isValid) {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY); // token hết hạn → xoá
      return null;
    }

    setAuthToken(saved.token);
    try {
      const user = await authService.getMe(saved.user.id); // GET /users/:id cần token hợp lệ
      return { ...saved, user };
    } catch (err: any) {
      // 401: token sai/hết hạn · 403: không phải chủ tài khoản · 404: user đã bị xoá
      if ([401, 403, 404].includes(err?.response?.status)) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthToken(null);
        return null;
      }
      return saved; // mất mạng: vẫn cho vào bằng dữ liệu đã lưu
    }
  } catch {
    return null; // dữ liệu hỏng → coi như chưa đăng nhập
  }
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const signedIn = (state: AuthState, r: AuthResult) => {
      state.user = r.user;
      state.token = r.token;
      state.isLoggedIn = true;
    };
    builder
      .addCase(login.fulfilled, (s, a) => signedIn(s, a.payload))
      .addCase(register.fulfilled, (s, a) => signedIn(s, a.payload))
      .addCase(restoreSession.fulfilled, (s, a) => {
        if (a.payload) signedIn(s, a.payload);
        s.restoring = false;
      })
      .addCase(restoreSession.rejected, (s) => {
        s.restoring = false;
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.isLoggedIn = false;
      });
  },
});

export default slice.reducer;