import axios from 'axios';
import { Platform } from 'react-native';

const LAN_IP = '192.168.1.5'; // TODO: đổi thành IPv4 của máy (gõ ipconfig)
const PORT = 3000;
const USE_REAL_DEVICE = true; // false nếu chạy emulator / web

const host = USE_REAL_DEVICE
  ? LAN_IP
  : Platform.OS === 'android'
  ? '10.0.2.2'
  : 'localhost';

export const BASE_URL = `http://${host}:${PORT}`;

export const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// json-server-auth trả lỗi dạng chuỗi, vd "Incorrect password"
export const getServerMessage = (err: any): string | undefined =>
  typeof err?.response?.data === 'string' ? err.response.data : undefined;