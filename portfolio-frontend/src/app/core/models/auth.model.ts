export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AdminUser {
  id: string;
  username: string;
}