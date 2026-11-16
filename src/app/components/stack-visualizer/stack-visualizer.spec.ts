import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StackVisualizer } from './stack-visualizer';

describe('StackVisualizer', () => {
  let component: StackVisualizer;
  let fixture: ComponentFixture<StackVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackVisualizer],
    }).compileComponents();

    fixture = TestBed.createComponent(StackVisualizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
