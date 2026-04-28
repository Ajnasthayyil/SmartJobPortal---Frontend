export interface RecruiterProfile {
  recruiterId: number;
  userId: number;
  fullName: string;
  email: string;
  companyName: string;
  website: string;
  industry: string;
  description: string;
  location: string;
  totalJobsPosted: number;
}

export interface PostJobRequest {
  title: string;
  description: string;
  location: string;
  jobType: string;
  minSalary: number | null;
  maxSalary: number | null;
  minExperienceYears: number;
  expiresAt: string | null;
  requiredSkills: string[];
}

export interface JobResponse {
  jobId: number;
  title: string;
  description: string;
  location: string;
  jobType: string;
  minSalary: number | null;
  maxSalary: number | null;
  minExperienceYears: number;
  isActive: boolean;
  postedAt: string;
  requiredSkills: string[];
  totalApplicants: number;
}

export interface ApplicantResponse {
  applicationId: number;
  candidateId: number;
  fullName: string;
  email: string;
  location: string;
  experienceYears: number;
  status: string;
  coverNote: string;
  appliedAt: string;
  candidateUserId: number;
  hasResume: boolean;
  resumeUrl?: string;
  skills: string[];
  totalScore: number | null;
  skillScore: number | null;
  missingSkills: string[];
  scoreLabel: string;
}