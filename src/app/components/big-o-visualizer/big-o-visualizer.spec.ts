import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BigOVisualizer } from './big-o-visualizer';

describe('BigOVisualizer', () => {
  let component: BigOVisualizer;
  let fixture: ComponentFixture<BigOVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigOVisualizer],
    }).compileComponents();

    fixture = TestBed.createComponent(BigOVisualizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
