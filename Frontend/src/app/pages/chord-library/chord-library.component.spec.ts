import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordLibraryComponent } from './chord-library.component';

describe('ChordLibraryComponent', () => {
  let component: ChordLibraryComponent;
  let fixture: ComponentFixture<ChordLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChordLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
