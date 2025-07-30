import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseDetailComponent } from './phase-detail.component';

describe('PhaseDetailComponent', () => {
  let component: PhaseDetailComponent;
  let fixture: ComponentFixture<PhaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
