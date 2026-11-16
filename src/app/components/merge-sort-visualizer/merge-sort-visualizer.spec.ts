import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MergeSortVisualizer } from './merge-sort-visualizer';

describe('MergeSortVisualizer', () => {
  let component: MergeSortVisualizer;
  let fixture: ComponentFixture<MergeSortVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeSortVisualizer],
    }).compileComponents();

    fixture = TestBed.createComponent(MergeSortVisualizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
