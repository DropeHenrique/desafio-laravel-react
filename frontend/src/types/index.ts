// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Song Types
export interface Song {
  id: number;
  title: string;
  artist: string;
  youtube_url: string;
  description?: string;
  views: number;
  position?: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface SongsResponse {
  top_five: Song[];
  paginated: PaginatedResponse<Song>;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

// Form Types
export interface SongFormData {
  title: string;
  artist: string;
  youtube_url: string;
  description?: string;
}

// Component Props Types
export interface SongCardProps {
  song: Song;
  onEdit?: (song: Song) => void;
  onDelete?: (song: Song) => void;
  onApprove?: (song: Song) => void;
  onReject?: (song: Song) => void;
  isAdmin?: boolean;
}

export interface SongFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  song?: Song | null;
  isEdit?: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; data?: AuthResponse }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; data?: AuthResponse }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateType {
  state: LoadingState;
  error?: string;
}
