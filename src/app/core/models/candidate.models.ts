export interface CandidateProfile {
  candidateId: number;
  userId: number;
  fullName: string;
  email: string;
  headline: string;
  summary: string;
  location: string;
  experienceYears: number;
  hasResume: boolean;
  resumeOriginalName: string;
  resumeUploadedAt: string;
  skills: SkillItem[];
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  profilePictureUrl?: string;
}

export interface SkillItem {
  skillName: string;
  level: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  duration: string;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface JobListItem {
  jobId: number;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  minSalary: number;
  maxSalary: number;
  minExperienceYears: number;
  requiredSkills: string[];
  matchScore: number | null;
  postedAt: string;
  isApplied?: boolean;
}

export interface MatchScoreResponse {
  jobId: number;
  jobTitle: string;
  totalScore: number;
  skillScore: number;
  experienceScore: number;
  locationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  scoreLabel: string;
}

export interface ApplicationTracking {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  status: string;
  matchScore: number | null;
  appliedAt: string;
  updatedAt: string;
  timeline: TimelineItem[];
}

export interface TimelineItem {
  status: string;
  isCompleted: boolean;
  isCurrent: boolean;
  occurredAt: string | null;
}