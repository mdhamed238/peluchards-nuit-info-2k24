export interface User {
  id: number;
  username: string;
  editor: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user_id: number;
  username: string;
  editor: boolean;
}
