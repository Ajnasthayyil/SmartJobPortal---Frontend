import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule, LayoutDashboard, User, Briefcase, FileText, TrendingUp, Bell, Users, PlusCircle, Settings, CheckCircle, BarChart3, MessageSquare, UserCheck } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  
  currentPath = '';
  links: any[] = [];

  readonly LayoutDashboard = LayoutDashboard;
  readonly User = User;
  readonly Briefcase = Briefcase;
  readonly FileText = FileText;
  readonly TrendingUp = TrendingUp;
  readonly Bell = Bell;
  readonly Users = Users;
  readonly PlusCircle = PlusCircle;
  readonly Settings = Settings;
  readonly CheckCircle = CheckCircle;
  readonly BarChart3 = BarChart3;
  readonly MessageSquare = MessageSquare;
  readonly UserCheck = UserCheck;

  candidateLinks = [
    { path: "/candidate/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/candidate/profile", icon: User, label: "Profile" },
    { path: "/candidate/jobs", icon: Briefcase, label: "Find Jobs" },
    { path: "/candidate/applications", icon: FileText, label: "Applications" },
    { path: "/candidate/skill-gap", icon: TrendingUp, label: "Skill Analysis" },
    { path: "/candidate/notifications", icon: Bell, label: "Notifications" },
  ];

  recruiterLinks = [
    { path: "/recruiter/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/recruiter/post-job", icon: PlusCircle, label: "Post Job" },
    { path: "/recruiter/jobs", icon: Briefcase, label: "Manage Jobs" },
    { path: "/recruiter/profile", icon: User, label: "Company Profile" },
  ];

  adminLinks = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "User Management" },
    { path: "/admin/recruiters", icon: UserCheck, label: "Approvals" },
    { path: "/admin/jobs", icon: Briefcase, label: "Job Monitoring" },
    { path: "/admin/reports", icon: BarChart3, label: "Reports" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLinks();
    });
    this.updateLinks();
  }

  updateLinks() {
    this.currentPath = this.location.path();
    if (this.currentPath.includes('/candidate')) {
      this.links = this.candidateLinks;
    } else if (this.currentPath.includes('/recruiter')) {
      this.links = this.recruiterLinks;
    } else if (this.currentPath.includes('/admin')) {
      this.links = this.adminLinks;
    } else {
      this.links = [];
    }
  }

}
