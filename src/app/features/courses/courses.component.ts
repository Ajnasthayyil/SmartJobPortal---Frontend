import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  COURSES, CATEGORIES, SKILL_TAGS,
  PLATFORM_CONFIG, Course
} from './courses.data';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  host: {
    '[class.candidate-view]': 'isCandidate'
  }
})
export class CoursesComponent {

  private router = inject(Router);

  get isCandidate(): boolean {
    return this.router.url.includes('/candidate');
  }

  // Pagination State
  currentPage = signal(1);
  pageSize = 8;

  // State
  search          = '';
  activeCategory  = 'All';
  activeTag       = 'All';
  activeLevel     = 'All';
  showFreeOnly    = false;

  // Data
  readonly allCourses   = COURSES;
  readonly categories   = CATEGORIES;
  readonly skillTags    = SKILL_TAGS;
  readonly levels       = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  readonly platformConf = PLATFORM_CONFIG;

  // Computed filtered list (Internal)
  private get allFiltered(): Course[] {
    return this.allCourses.filter(c => {
      const matchSearch   = !this.search ||
        c.title.toLowerCase().includes(this.search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(this.search.toLowerCase())) ||
        c.instructor.toLowerCase().includes(this.search.toLowerCase());

      const matchCategory = this.activeCategory === 'All' ||
        c.category === this.activeCategory;

      const matchTag      = this.activeTag === 'All' ||
        c.tags.some(t =>
          t.toLowerCase() === this.activeTag.toLowerCase()
        );

      const matchLevel    = this.activeLevel === 'All' ||
        c.level === this.activeLevel;

      const matchFree     = !this.showFreeOnly || c.isFree;

      return matchSearch && matchCategory &&
             matchTag && matchLevel && matchFree;
    });
  }

  // Computed paginated list for template
  get filtered(): Course[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allFiltered.slice(start, start + this.pageSize);
  }

  get totalFilteredCount(): number {
    return this.allFiltered.length;
  }

  get totalPages(): number {
    return Math.ceil(this.allFiltered.length / this.pageSize);
  }

  changePage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.currentPage.set(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get freeCount(): number {
    return this.allCourses.filter(c => c.isFree).length;
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.activeTag = 'All';
  }

  setTag(tag: string): void {
    this.activeTag = tag;
  }

  setLevel(level: string): void {
    this.activeLevel = level;
  }

  clearFilters(): void {
    this.search         = '';
    this.activeCategory = 'All';
    this.activeTag      = 'All';
    this.activeLevel    = 'All';
    this.showFreeOnly   = false;
  }

  getPlatformStyle(platform: string): { color: string; background: string } {
    const conf = this.platformConf[platform];
    return conf
      ? { color: conf.color, background: conf.bg }
      : { color: '#6b7280', background: '#f3f4f6' };
  }

  openCourse(url: string): void {
    window.open(url, '_blank', 'noopener');
  }

  get hasActiveFilters(): boolean {
    return this.search !== '' ||
           this.activeCategory !== 'All' ||
           this.activeTag !== 'All' ||
           this.activeLevel !== 'All' ||
           this.showFreeOnly;
  }
}