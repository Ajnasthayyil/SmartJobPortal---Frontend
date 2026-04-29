import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPublicDetailComponent } from './job-public-detail.component';

describe('JobPublicDetailComponent', () => {
  let component: JobPublicDetailComponent;
  let fixture: ComponentFixture<JobPublicDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobPublicDetailComponent]
    });
    fixture = TestBed.createComponent(JobPublicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
