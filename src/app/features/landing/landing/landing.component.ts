import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  activeFilter = 'All';

  filters = ['All', 'Full Time', 'Remote', 'Internship', 'Part Time', '₹0–₹20k', '₹20k–₹60k', '₹60k+'];

  stats = [
    { num: '48', suffix: 'K+', label: 'Live Jobs' },
    { num: '12', suffix: 'K+', label: 'Companies' },
    { num: '3.2', suffix: 'M+', label: 'Candidates' },
    { num: '94', suffix: '%', label: 'Placement Rate' },
  ];

  jobs = [
    { logoClass: 'logo-a', logoText: 'GG', title: 'Senior React Developer', company: 'Google India', badgeClass: 'badge-remote', badgeLabel: 'Remote', tags: ['React', 'TypeScript', 'GraphQL'], salary: '₹45–₹65L/yr', timeAgo: '2h ago', match: 98 },
    { logoClass: 'logo-b', logoText: 'AZ', title: 'Cloud Solutions Architect', company: 'Amazon Web Services', badgeClass: 'badge-full', badgeLabel: 'Full Time', tags: ['AWS', 'Terraform', 'Kubernetes'], salary: '₹80–₹1.2Cr/yr', timeAgo: '5h ago', match: 95 },
    { logoClass: 'logo-c', logoText: 'SW', title: 'Product Designer', company: 'Swiggy', badgeClass: 'badge-full', badgeLabel: 'Full Time', tags: ['Figma', 'UX Research', 'Prototyping'], salary: '₹25–₹40L/yr', timeAgo: '1d ago', match: 91 },
    { logoClass: 'logo-d', logoText: 'ZM', title: 'Data Science Intern', company: 'Zepto', badgeClass: 'badge-intern', badgeLabel: 'Internship', tags: ['Python', 'ML', 'SQL'], salary: '₹30–₹50k/mo', timeAgo: '3h ago', match: 89 },
    { logoClass: 'logo-e', logoText: 'RZ', title: 'Backend Engineer — Go', company: 'Razorpay', badgeClass: 'badge-remote', badgeLabel: 'Remote', tags: ['Go', 'Kafka', 'PostgreSQL'], salary: '₹35–₹55L/yr', timeAgo: '6h ago', match: 87 },
    { logoClass: 'logo-f', logoText: 'BY', title: 'Growth Marketing Lead', company: "BYJU'S", badgeClass: 'badge-part', badgeLabel: 'Part Time', tags: ['SEO', 'Analytics', 'Content'], salary: '₹15–₹25L/yr', timeAgo: '12h ago', match: 84 },
  ];

  categories = [
    { icon: '💻', name: 'Technology', count: '12,430 jobs' },
    { icon: '📊', name: 'Data & Analytics', count: '4,820 jobs' },
    { icon: '🎨', name: 'Design & UX', count: '2,910 jobs' },
    { icon: '📱', name: 'Mobile Dev', count: '3,200 jobs' },
    { icon: '☁️', name: 'Cloud & DevOps', count: '5,600 jobs' },
    { icon: '📢', name: 'Marketing', count: '6,720 jobs' },
    { icon: '💰', name: 'Finance', count: '3,480 jobs' },
    { icon: '🤖', name: 'AI & Machine Learning', count: '2,150 jobs' },
  ];

  companies = [
    { logoClass: 'logo-a', logoText: 'GG', name: 'Google', industry: 'Technology', openRoles: 142 },
    { logoClass: 'logo-b', logoText: 'AZ', name: 'Amazon', industry: 'E-Commerce & Cloud', openRoles: 89 },
    { logoClass: 'logo-e', logoText: 'RZ', name: 'Razorpay', industry: 'Fintech', openRoles: 34 },
    { logoClass: 'logo-c', logoText: 'SW', name: 'Swiggy', industry: 'Food Tech', openRoles: 57 },
  ];

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }
}