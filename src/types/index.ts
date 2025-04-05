// User types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer_success' | 'brand' | 'creator';
  name: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
  updated_at: string;
}

// Auth types
export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
}