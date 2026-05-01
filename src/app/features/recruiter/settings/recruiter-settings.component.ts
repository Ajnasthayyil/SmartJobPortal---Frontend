import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Settings</h1>
      <p>System settings configuration will appear here.</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 140px 32px 60px;
      font-family: 'Inter', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; margin-bottom: 16px; }
    p { color: #64748b; }
  `]
})
export class RecruiterSettingsComponent {}
