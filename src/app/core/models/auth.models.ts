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
  accessToken: string;
  role: string;
  fullName: string;
  userId: number;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  statusCode: number;
}