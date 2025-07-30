import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDModelComponent } from './three-dmodel.component';

describe('ThreeDModelComponent', () => {
  let component: ThreeDModelComponent;
  let fixture: ComponentFixture<ThreeDModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeDModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreeDModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
