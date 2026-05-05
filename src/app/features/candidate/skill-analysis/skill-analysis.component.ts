import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CandidateService } from '../../../core/services/candidate.service';
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

  constructor(private http: HttpClient, private candidateService: CandidateService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    
    // Fetch both Profile and Jobs to calculate real gaps
    import('rxjs').then(({ forkJoin }) => {
      forkJoin({
        profile: this.candidateService.getProfile(),
        jobs: this.candidateService.searchJobs({ pageSize: 10 })
      }).subscribe({
        next: (results: any) => {
          const profile = results.profile.data;
          const jobs = results.jobs.data.jobs || [];
          const userSkills = profile?.skills?.map((s: any) => s.skillName.toLowerCase()) || [];
          
          // Map real DB jobs to the analysis format
          const jobMatches = jobs.map((j: any) => {
            const title = j.title || 'Unknown Role';
            const desc = (j.description || '').toLowerCase();
            
            // Simple logic: find common tech keywords in description
            const commonTech = ['c#', '.net', 'sql', 'react', 'angular', 'node', 'javascript', 'typescript', 'css', 'html', 'fullstack'];
            const requiredSkills = commonTech.filter(tech => desc.includes(tech));
            
            const matchedSkills = requiredSkills.filter(s => userSkills.includes(s));
            const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));
            
            // Calculate match percentage
            const matchPercentage = requiredSkills.length > 0 
              ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
              : 50;

            return {
              title: j.title,
              company: j.companyName || 'Local Tech Partner',
              location: j.location || 'Not Specified',
              matchPercentage: matchPercentage > 0 ? matchPercentage : 50,
              matchedSkills: matchedSkills.map(s => s.toUpperCase()),
              missingSkills: missingSkills.map(s => s.toUpperCase()),
              missingInsight: missingSkills.length > 0 
                ? `Highly requested for this ${j.title} role in ${j.location}.`
                : 'You have a perfect core match for this position!'
            };
          });

          // Aggregate gaps from real data
          const allMissing = jobMatches.flatMap((m: any) => m.missingSkills);
          const gapCounts: Record<string, number> = {};
          allMissing.forEach((s: string) => gapCounts[s] = (gapCounts[s] || 0) + 1);
          
          const aggregatedGaps = Object.keys(gapCounts)
            .sort((a, b) => gapCounts[b] - gapCounts[a])
            .slice(0, 4)
            .map(name => ({
              name,
              demand: `Found in ${gapCounts[name]} of your matches`,
              importance: gapCounts[name] > 1 ? 'High' : 'Medium'
            }));

          this.data.set({
            readiness: jobMatches.length > 0 ? Math.round(jobMatches.reduce((acc: number, curr: any) => acc + curr.matchPercentage, 0) / jobMatches.length) : 0,
            potentialJobMatches: jobMatches.length,
            isSimulation: false,
            jobMatches: jobMatches,
            aggregatedGaps: aggregatedGaps,
            aiInsight: jobMatches.length > 0 
              ? `We found **${jobMatches.length} jobs** in your area (Kerala/Kochi/Calicut). By adding **${aggregatedGaps[0]?.name || 'more niche skills'}** to your profile, you can increase your match score for the ${jobMatches[0]?.title} role.`
              : 'Add more skills to your profile to see how you match against the 3 jobs currently in our database.',
            recommendedLearning: aggregatedGaps.slice(0, 2).map(g => ({
              title: `${g.name} Fundamentals for Professionals`,
              source: 'Platform Recommended',
              hours: '10'
            }))
          });

          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    });
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