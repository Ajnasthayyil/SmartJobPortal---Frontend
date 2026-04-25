export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCandidateRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: number; // 3 = Candidate
}

export interface RegisterRecruiterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: number; // 2 = Recruiter
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