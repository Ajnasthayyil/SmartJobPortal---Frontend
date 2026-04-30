import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
    { icon: 'fa-solid fa-laptop-code', name: 'Technology', count: 12430 },
    { icon: 'fa-solid fa-chart-line', name: 'Data & Analytics', count: 4820 },
    { icon: 'fa-solid fa-palette', name: 'Design & UX', count: 2910 },
    { icon: 'fa-solid fa-mobile-screen-button', name: 'Mobile Dev', count: 3200 },
    { icon: 'fa-solid fa-cloud-arrow-up', name: 'Cloud & DevOps', count: 5600 },
    { icon: 'fa-solid fa-bullhorn', name: 'Marketing', count: 6720 },
    { icon: 'fa-solid fa-sack-dollar', name: 'Finance', count: 3480 },
    { icon: 'fa-solid fa-robot', name: 'AI & Machine Learning', count: 2150 },
  ];

  // For animated counters
  displayCounts: number[] = [];

  ngOnInit() {
    this.categories.forEach((cat, i) => {
      this.displayCounts[i] = 0;
      this.animateCount(i, cat.count);
    });
  }

  animateCount(index: number, target: number) {
    const duration = 2000;
    const start = 0;
    const step = (timestamp: number) => {
      if (!this.startTime) this.startTime = timestamp;
      const progress = Math.min((timestamp - this.startTime) / duration, 1);
      this.displayCounts[index] = Math.floor(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  private startTime: number | null = null;

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