export interface AdminDashboard {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  pendingRecruiterApprovals: number;
  blockedUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsToday: number;
  recentUsers: RecentUser[];
  recentJobs: RecentJob[];
}

export interface RecentUser {
  userId: number;
  fullName: string;
  email: string;
  roleName: string;
  createdAt: string;
}

export interface RecentJob {
  jobId: number;
  title: string;
  companyName: string;
  location: string;
  totalApplicants: number;
  postedAt: string;
}

export interface UserListItem {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface RecruiterApproval {
  userId: number;
  recruiterId: number;
  fullName: string;
  email: string;
  companyName: string;
  industry: string;
  location: string;
  isApproved: boolean;
  registeredAt: string;
}