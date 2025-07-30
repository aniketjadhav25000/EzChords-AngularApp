import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BollywoodSongsComponent } from './bollywood-songs.component';

describe('BollywoodSongsComponent', () => {
  let component: BollywoodSongsComponent;
  let fixture: ComponentFixture<BollywoodSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BollywoodSongsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BollywoodSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
