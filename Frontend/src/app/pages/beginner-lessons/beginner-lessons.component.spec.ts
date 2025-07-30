import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginnerLessonsComponent } from './beginner-lessons.component';

describe('BeginnerLessonsComponent', () => {
  let component: BeginnerLessonsComponent;
  let fixture: ComponentFixture<BeginnerLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeginnerLessonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeginnerLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
