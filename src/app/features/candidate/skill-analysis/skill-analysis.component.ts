import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-skill-analysis',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './skill-analysis.component.html',
  styleUrls: ['./skill-analysis.component.scss']
})
export class SkillAnalysisComponent implements OnInit {

  data    = signal<any>(null);
  loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    // Refactored Job-Centric Mock Data
    const mockData = {
      readiness: 68,
      missingSkillsCount: 4,
      potentialJobMatches: 24,
      jobMatches: [
        {
          title: 'Senior Full Stack Developer',
          company: 'TechCorp Solutions',
          location: 'Remote',
          salary: '$120k - $150k',
          matchPercentage: 82,
          matchedSkills: ['React.js', 'Node.js', 'SQL', 'TypeScript'],
          missingSkills: ['Docker', 'AWS'],
          missingInsight: 'Critical for their infrastructure'
        },
        {
          title: 'Lead Frontend Engineer',
          company: 'Innovate AI',
          location: 'San Francisco (Hybrid)',
          salary: '$140k+',
          matchPercentage: 75,
          matchedSkills: ['React.js', 'TypeScript', 'Jest'],
          missingSkills: ['GraphQL', 'Apollo'],
          missingInsight: 'Used for all data fetching'
        },
        {
          title: 'Backend Developer (Node.js)',
          company: 'CloudFlow',
          location: 'Remote',
          salary: '$110k+',
          matchPercentage: 70,
          matchedSkills: ['Node.js', 'SQL', 'Redis'],
          missingSkills: ['Kubernetes', 'Go'],
          missingInsight: 'Needed for microservices'
        },
        {
          title: 'Product Engineer',
          company: 'FinTech Hub',
          location: 'London',
          salary: '£80k+',
          matchPercentage: 65,
          matchedSkills: ['React.js', 'Node.js'],
          missingSkills: ['TypeScript', 'Testing Library'],
          missingInsight: 'High quality standards'
        }
      ],
      aggregatedGaps: [
        { name: 'Docker', demand: 'Found in 18 available jobs', importance: 'High' },
        { name: 'AWS', demand: 'Found in 15 available jobs', importance: 'High' },
        { name: 'GraphQL', demand: 'Found in 12 available jobs', importance: 'Medium' },
        { name: 'Kubernetes', demand: 'Found in 8 available jobs', importance: 'Low' }
      ],
      aiInsight: 'Your core skills (React, Node) are strong. Adding **Docker** and **AWS** would allow you to apply for 15+ "High Salary" Senior roles that you are currently just 2 skills away from.',
      recommendedLearning: [
        { title: 'Docker Mastery for Developers', source: 'Udemy', hours: '12' },
        { title: 'AWS Certified Developer Associate', source: 'A Cloud Guru', hours: '20' }
      ]
    };
    
    setTimeout(() => {
      this.data.set(mockData);
      this.loading.set(false);
    }, 800);
  }

  getStrengthLabel(pct: number): string {
    if (pct >= 70) return 'Strong';
    if (pct >= 40) return 'Good';
    return 'Gap';
  }

  getBarClass(pct: number): string {
    if (pct >= 70) return 'bar-green';
    if (pct >= 40) return 'bar-amber';
    return 'bar-red';
  }

  getTagClass(pct: number): string {
    if (pct >= 70) return 'tag-strong';
    if (pct >= 40) return 'tag-medium';
    return 'tag-low';
  }

  getDashOffset(pct: number): number {
    return 2 * Math.PI * 22 * (1 - pct / 100);
  }
}