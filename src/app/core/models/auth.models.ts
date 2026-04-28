export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCandidateRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export interface RegisterRecruiterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface UserSession {
  accessToken: string;
  role: string;
  email: string;
  userId: number;
  fullName?: string;
  profilePictureUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  statusCode: number;
}