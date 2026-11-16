import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepControlsComponent } from './step-controls.component';
import { StackVisualizerComponent } from
  './components/stack-visualizer/stack-visualizer';
  import { QueueVisualizerComponent } from './components/queue-visualizer/queue-visualizer';
  import { MergeSortVisualizerComponent } from
  './components/merge-sort-visualizer/merge-sort-visualizer';
  import { BigOVisualizerComponent } from './components/big-o-visualizer/big-o-visualizer';

type LessonCategory = 'All' | 'Searching' | 'Sorting' | 'Data Structures';

interface LessonCard {
  id: string;
  title: string;
  category: Exclude<LessonCategory, 'All'>;
  description: string;
  level: string;
  duration: string;
  icon: string;
  available: boolean;
}

interface SearchStep {
  low: number;
  high: number;
  mid: number;
  found: boolean;
  done: boolean;
  explanation: string;
  title: string;
  currentIndex?: number;
  array?: number[];
  compareLeft?: number;
  compareRight?: number;
  comparisons?: number;
  swaps?: number;
  swapped?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StepControlsComponent, StackVisualizerComponent, QueueVisualizerComponent, MergeSortVisualizerComponent, BigOVisualizerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly categories: LessonCategory[] = [
    'All', 'Searching', 'Sorting', 'Data Structures'
  ];

  readonly lessons: LessonCard[] = [
    {
      id: 'binary-search',
      title: 'Binary Search',
      category: 'Searching',
      description: 'Find an item in a sorted array by repeatedly cutting the search range in half.',
      level: 'Beginner',
      duration: '8 min',
      icon: '⌕',
      available: true
    },
    {
      id: 'linear-search',
      title: 'Linear Search',
      category: 'Searching',
      description: 'See how an algorithm checks values one by one until it finds a match.',
      level: 'Beginner',
      duration: '5 min',
      icon: '↗',
      available: true
    },
    {
      id: 'bubble-sort',
      title: 'Bubble Sort',
      category: 'Sorting',
      description: 'Watch adjacent values compare and swap until the list is sorted.',
      level: 'Beginner',
      duration: '10 min',
      icon: '⇅',
      available: true
    },
    {
      id: 'stack',
      title: 'Stack',
      category: 'Data Structures',
      description: 'Understand last-in, first-out with a visual stack of items.',
      level: 'Beginner',
      duration: '7 min',
      icon: '▤',
      available: true
    },
    {
      id: 'queue',
      title: 'Queue',
      category: 'Data Structures',
      description: 'Explore first-in, first-out using a simple queue simulation.',
      level: 'Beginner',
      duration: '7 min',
      icon: '⇥',
      available: true
    },
    {
      id: 'merge-sort',
      title: 'Merge Sort',
      category: 'Sorting',
      description: 'Explore divide and conquer by splitting and merging arrays.',
      level: 'Intermediate',
      duration: '12 min',
      icon: '⤢',
      available: true
    },
    {
    id: 'big-o',
    title: 'Big-O Complexity',
    category: 'Data Structures',
    level: 'Intermediate',
    duration: '10 min',
    icon: 'Ω',
    description: 'Understand algorithm performance and growth rates.',
    available: true
}
  ];

  readonly selectedCategory = signal<LessonCategory>('All');
  readonly searchText = signal('');
  readonly activeLesson = signal('binary-search');

  readonly filteredLessons = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.lessons.filter(lesson => {
      const matchesCategory = category === 'All' || lesson.category === category;
      const matchesSearch =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  readonly values = signal<number[]>([3, 7, 11, 18, 23, 29, 34, 41, 56]);
  readonly target = signal<number>(29);
  readonly defaultSearchValues = [3, 7, 11, 18, 23, 29, 34, 41, 56];
  readonly defaultSortValues = [34, 12, 25, 9, 48, 17];
  readonly steps = signal<SearchStep[]>([]);
  readonly stepIndex = signal(0);
  readonly inputError = signal('');

  readonly currentStep = computed(() => this.steps()[this.stepIndex()]);
  readonly isFirstStep = computed(() => this.stepIndex() === 0);
  readonly isLastStep = computed(() => this.stepIndex() >= this.steps().length - 1);

  constructor() {
    this.buildSteps();
  }

  selectCategory(category: LessonCategory): void {
    this.selectedCategory.set(category);
  }

  setSearchText(value: string): void {
    this.searchText.set(value);
  }

  selectLesson(lesson: LessonCard): void {
    if (!lesson.available) return;
    this.activeLesson.set(lesson.id);
    if (lesson.id === 'bubble-sort') {
      this.values.set([...this.defaultSortValues]);
    } else if (lesson.id === 'binary-search') {
      this.values.set([...this.defaultSearchValues]);
    }
    this.buildSteps();
    document.getElementById('lesson-workspace')?.scrollIntoView({ behavior: 'smooth' });
  }

  setTarget(value: string): void {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      this.inputError.set('Enter a whole number.');
      return;
    }
    this.inputError.set('');
    this.target.set(parsed);
    this.buildSteps();
  }

  setArray(value: string): void {
    const parsed = value
      .split(',')
      .map(item => Number(item.trim()));

    if (
      parsed.length < 2 ||
      parsed.length > 14 ||
      parsed.some(item => !Number.isInteger(item)) ||
      (this.activeLesson() === 'binary-search' && parsed.some((item, index) => index > 0 && item <= parsed[index - 1]))
    ) {
      this.inputError.set(this.activeLesson() === 'binary-search'
        ? 'Enter 2–14 unique integers in ascending order, separated by commas.'
        : 'Enter between 2 and 14 whole numbers, separated by commas.');
      return;
    }

    this.inputError.set('');
    this.values.set(parsed);
    this.buildSteps();
  }

  nextStep(): void {
    if (!this.isLastStep()) this.stepIndex.update(index => index + 1);
  }

  previousStep(): void {
    if (!this.isFirstStep()) this.stepIndex.update(index => index - 1);
  }

  reset(): void {
    this.stepIndex.set(0);
  }

  restartWithDefaults(): void {
    this.values.set(this.activeLesson() === 'bubble-sort' ? [...this.defaultSortValues] : [...this.defaultSearchValues]);
    this.target.set(29);
    this.inputError.set('');
    this.buildSteps();
  }

  private buildSteps(): void {
    if (this.activeLesson() === 'stack' || this.activeLesson() === 'queue' || 
    this.activeLesson() === 'merge-sort' || this.activeLesson() === 'big-o') {
    this.steps.set([]);
    this.stepIndex.set(0);
    return;
  }
    if (this.activeLesson() === 'bubble-sort') {
      this.buildBubbleSortSteps();
      return;
    }
    if (this.activeLesson() === 'linear-search') {
      this.buildLinearSearchSteps();
      return;
    }
    this.buildBinarySearchSteps();
  }

  private buildBinarySearchSteps(): void {
    const data = this.values();
    const target = this.target();
    const result: SearchStep[] = [];
    let low = 0;
    let high = data.length - 1;
    let found = false;

    result.push({
      low, high, mid: -1, found: false, done: false,
      title: 'Start with the full sorted array',
      explanation: `Binary Search works on sorted data. We begin with the entire range, from index ${low} to index ${high}.`
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (data[mid] === target) {
        found = true;
        result.push({
          low, high, mid, found: true, done: true,
          title: `Target found at index ${mid}`,
          explanation: `${data[mid]} equals the target ${target}. The search is complete.`
        });
        break;
      }

      if (data[mid] < target) {
        result.push({
          low, high, mid, found: false, done: false,
          title: `Middle value ${data[mid]} is too small`,
          explanation: `${data[mid]} is less than ${target}. Because the array is sorted, discard the middle and everything to its left.`
        });
        low = mid + 1;
      } else {
        result.push({
          low, high, mid, found: false, done: false,
          title: `Middle value ${data[mid]} is too large`,
          explanation: `${data[mid]} is greater than ${target}. Because the array is sorted, discard the middle and everything to its right.`
        });
        high = mid - 1;
      }
    }

    if (!found) {
      result.push({
        low, high, mid: -1, found: false, done: true,
        title: 'Target is not in this array',
        explanation: `The search range is empty. The value ${target} does not exist in the array.`
      });
    }

    this.steps.set(result);
    this.stepIndex.set(0);
  }

  private buildLinearSearchSteps(): void {
    const data = this.values();
    const target = this.target();
    const result: SearchStep[] = [{
      low: 0, high: data.length - 1, mid: -1, currentIndex: 0,
      found: false, done: false,
      title: 'Start at the first element',
      explanation: 'Linear Search starts at index 0 and checks each element from left to right.'
    }];

    let foundIndex = -1;
    for (let index = 0; index < data.length; index++) {
      const found = data[index] === target;
      result.push({
        low: 0, high: data.length - 1, mid: -1, currentIndex: index,
        found, done: found,
        title: found ? `Target found at index ${index}` : `Check index ${index}: ${data[index]}`,
        explanation: found
          ? `${data[index]} matches the target ${target}. We can stop searching.`
          : `${data[index]} does not match ${target}. Move to the next element.`,
      });
      if (found) {
        foundIndex = index;
        break;
      }
    }

    if (foundIndex === -1) {
      result.push({
        low: 0, high: data.length - 1, mid: -1, currentIndex: data.length,
        found: false, done: true,
        title: 'Target not found',
        explanation: `Every element was checked. The value ${target} is not present in this array.`
      });
    }

    this.steps.set(result);
    this.stepIndex.set(0);
  }

  private buildBubbleSortSteps(): void {
    const working = [...this.values()];
    const result: SearchStep[] = [{
      low: 0, high: working.length - 1, mid: -1, found: false, done: false,
      array: [...working], compareLeft: -1, compareRight: -1, comparisons: 0, swaps: 0,
      title: 'Start with the unsorted array',
      explanation: 'Bubble Sort compares neighboring values. If the left value is greater, it swaps them so larger values move toward the right.'
    }];
    let comparisons = 0;
    let swaps = 0;

    for (let pass = 0; pass < working.length - 1; pass++) {
      let swappedInPass = false;
      for (let index = 0; index < working.length - pass - 1; index++) {
        const left = working[index];
        const right = working[index + 1];
        comparisons++;
        const shouldSwap = left > right;
        if (shouldSwap) {
          working[index] = right;
          working[index + 1] = left;
          swaps++;
          swappedInPass = true;
        }
        result.push({
          low: 0, high: working.length - 1, mid: -1, found: false, done: false,
          array: [...working], compareLeft: index, compareRight: index + 1,
          comparisons, swaps, swapped: shouldSwap,
          title: shouldSwap ? `Swap ${left} and ${right}` : `Keep ${left} and ${right} in place`,
          explanation: shouldSwap
            ? `${left} is greater than ${right}, so swap the adjacent values. The larger value moves one position to the right.`
            : `${left} is already less than or equal to ${right}, so no swap is needed.`
        });
      }
      if (!swappedInPass) break;
    }

    result.push({
      low: 0, high: working.length - 1, mid: -1, found: true, done: true,
      array: [...working], compareLeft: -1, compareRight: -1,
      comparisons, swaps,
      title: 'Array is sorted!',
      explanation: `Bubble Sort is complete. The algorithm made ${comparisons} comparisons and ${swaps} swaps.`
    });
    this.steps.set(result);
    this.stepIndex.set(0);
  }

  cellState(index: number): string {
    const step = this.currentStep();
    if (!step) return 'outside';
    if (this.activeLesson() === 'bubble-sort') {
      if (step.done) return 'sorted';
      if (index === step.compareLeft || index === step.compareRight) return step.swapped ? 'swap-active' : 'compare-active';
      return 'sort-idle';
    }
    if (this.activeLesson() === 'linear-search') {
      if (step.found && index === step.currentIndex) return 'found';
      if (index === step.currentIndex) return 'middle';
      if (step.currentIndex !== undefined && step.currentIndex >= 0 && index < step.currentIndex) return 'discarded';
      return 'active';
    }
    if (step.found && index === step.mid) return 'found';
    if (step.mid === index) return 'middle';
    if (index < step.low || index > step.high) return 'discarded';
    if (index === step.low) return 'low';
    if (index === step.high) return 'high';
    return 'active';
  }

  get resultText(): string {
    const finalStep = this.steps()[this.steps().length - 1];
    if (this.activeLesson() === 'bubble-sort') {
      return this.currentStep()?.done ? 'Array sorted successfully' : 'Sorting in progress…';
    }
    if (!finalStep?.done) return 'Searching…';
    const foundIndex = this.activeLesson() === 'linear-search' ? finalStep.currentIndex : finalStep.mid;
    return finalStep.found ? `Found at index ${foundIndex}` : 'Value not found';
  }

  get activeLessonTitle(): string {
    return this.lessons.find(item => item.id === this.activeLesson())?.title ?? 'Binary Search';
  }

  trackByLesson(_index: number, lesson: LessonCard): string {
    return lesson.id;
  }
}
