export const validateName = (v: string) => (v.trim() ? '' : 'Vui lòng nhập họ tên');

export const validateEmail = (v: string) =>
  !v.trim()
    ? 'Vui lòng nhập email'
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? ''
    : 'Email không đúng định dạng';

export const validatePassword = (v: string) =>
  !v ? 'Vui lòng nhập mật khẩu' : v.length < 6 ? 'Mật khẩu tối thiểu 6 ký tự' : '';