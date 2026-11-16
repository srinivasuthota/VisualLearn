
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface MergeTreeNode {
  id: number;
  depth: number;
  position: number;
  values: number[];
  status: 'pending' | 'split' | 'merged' | 'leaf';
}

interface MergeTreeLevel {
  depth: number;
  columns: number;
  nodes: MergeTreeNode[];
}

interface MergeStep {
  values: number[];
  activeIndices: number[];
  left: number[];
  right: number[];
  phase: 'split' | 'merge' | 'complete';
  explanation: string;
  treeLevels: MergeTreeLevel[];

  compareLeft: number | null;
  compareRight: number | null;
  selectedValue: number | null;
  mergedValues: number[];
  compareLeftIndex: number | null;
compareRightIndex: number | null;
}

@Component({
  selector: 'app-merge-sort-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merge-sort-visualizer.html',
  styleUrl: './merge-sort-visualizer.css'
})
export class MergeSortVisualizerComponent {

  readonly defaultValues = [38, 27, 43, 3, 9, 82, 10];

  values = signal<number[]>([...this.defaultValues]);
  steps = signal<MergeStep[]>([]);
  stepIndex = signal(0);

  currentStep = computed(() => this.steps()[this.stepIndex()]);
  isFirstStep = computed(() => this.stepIndex() === 0);
  complexityLevels = computed(() =>
  this.currentStep().treeLevels.map(level => ({
    depth: level.depth,
    subarrays: level.nodes.length
  }))
);
  isLastStep = computed(
    () => this.stepIndex() >= this.steps().length - 1
  );

  constructor() {
    this.buildSteps();
  }

  private buildSteps(): void {
    const array = [...this.values()];
    const generatedSteps: MergeStep[] = [];
    const treeNodes: MergeTreeNode[] = [];

    let nextNodeId = 0;

    const root: MergeTreeNode = {
      id: nextNodeId++,
      depth: 0,
      position: 0,
      values: [...array],
      status: 'pending'
    };

    treeNodes.push(root);

    // Create recursion tree snapshots
    const createTreeLevels = (): MergeTreeLevel[] => {
      const maxDepth = Math.max(
        ...treeNodes.map(node => node.depth)
      );

      return Array.from({ length: maxDepth + 1 }, (_, depth) => {
        const nodes = treeNodes
          .filter(node => node.depth === depth)
          .map(node => ({
            ...node,
            values: [...node.values]
          }));

        return {
          depth,
          columns: Math.pow(2, depth),
          nodes
        };
      });
    };

    // Save every visualization step
    const saveStep = (
      values: number[],
      activeIndices: number[],
      left: number[],
      right: number[],
      phase: 'split' | 'merge' | 'complete',
      explanation: string,
      compareLeft: number | null = null,
      compareRight: number | null = null,
      selectedValue: number | null = null,
      mergedValues: number[] = [],
      compareLeftIndex: number | null = null,
compareRightIndex: number | null = null
    ): void => {

      generatedSteps.push({
        values: [...values],
        activeIndices: [...activeIndices],
        left: [...left],
        right: [...right],
        phase,
        explanation,
        treeLevels: createTreeLevels(),

        compareLeft,
        compareRight,
        selectedValue,
        mergedValues: [...mergedValues],
        compareLeftIndex,
compareRightIndex
      });
    };

    // Recursive Merge Sort
    const mergeSort = (
      arr: number[],
      start: number,
      end: number,
      nodeId: number,
      depth: number,
      position: number
    ): void => {

      const currentNode = treeNodes.find(
        node => node.id === nodeId
      )!;

      // Base case: one element is already sorted
      if (start >= end) {
        currentNode.status = 'leaf';
        return;
      }

      const mid = Math.floor((start + end) / 2);

      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);

      const leftNode: MergeTreeNode = {
        id: nextNodeId++,
        depth: depth + 1,
        position: position * 2,
        values: [...left],
        status: 'pending'
      };

      const rightNode: MergeTreeNode = {
        id: nextNodeId++,
        depth: depth + 1,
        position: position * 2 + 1,
        values: [...right],
        status: 'pending'
      };

      treeNodes.push(leftNode, rightNode);

      currentNode.status = 'split';

      saveStep(
        arr,
        this.range(start, end),
        left,
        right,
        'split',
        `Divide [${arr.slice(start, end + 1).join(', ')}] into [${left.join(', ')}] and [${right.join(', ')}].`
      );

      // Recursively divide both halves
      mergeSort(
        arr,
        start,
        mid,
        leftNode.id,
        depth + 1,
        position * 2
      );

      mergeSort(
        arr,
        mid + 1,
        end,
        rightNode.id,
        depth + 1,
        position * 2 + 1
      );

      // Both halves are now sorted
      const sortedLeft = arr.slice(start, mid + 1);
      const sortedRight = arr.slice(mid + 1, end + 1);

      let i = 0;
      let j = 0;

      const merged: number[] = [];

      // Compare and merge elements one by one
      while (
        i < sortedLeft.length &&
        j < sortedRight.length
      ) {

        const leftValue = sortedLeft[i];
        const rightValue = sortedRight[j];

        // Show comparison
        saveStep(
          arr,
          this.range(start, end),
          sortedLeft,
          sortedRight,
          'merge',
          `Comparing ${leftValue} and ${rightValue}.`,
          leftValue,
          rightValue,
          null,
          merged,
          i,
          j
        );

        let selectedValue: number;

        if (leftValue <= rightValue) {
          selectedValue = leftValue;
          merged.push(leftValue);
          i++;
        } else {
          selectedValue = rightValue;
          merged.push(rightValue);
          j++;
        }

        // Show selected element
        saveStep(
          arr,
          this.range(start, end),
          sortedLeft,
          sortedRight,
          'merge',
          `${selectedValue} selected and added to the merged result.`,
          leftValue,
          rightValue,
          selectedValue,
          merged,
          i,
          j
        );
      }

      // Add remaining left elements one by one
      while (i < sortedLeft.length) {
        const selectedValue = sortedLeft[i];

        merged.push(selectedValue);
        i++;

        saveStep(
          arr,
          this.range(start, end),
          sortedLeft,
          sortedRight,
          'merge',
          `Add remaining left element ${selectedValue} to the result.`,
          selectedValue,
          null,
          selectedValue,
          merged
        );
      }

      // Add remaining right elements one by one
      while (j < sortedRight.length) {
        const selectedValue = sortedRight[j];

        merged.push(selectedValue);
        j++;

        saveStep(
          arr,
          this.range(start, end),
          sortedLeft,
          sortedRight,
          'merge',
          `Add remaining right element ${selectedValue} to the result.`,
          null,
          selectedValue,
          selectedValue,
          merged
        );
      }

      // Copy merged elements back into original array
      arr.splice(start, merged.length, ...merged);

      currentNode.values = [...merged];
      currentNode.status = 'merged';

      // Save completed merge
      saveStep(
        arr,
        this.range(start, end),
        sortedLeft,
        sortedRight,
        'merge',
        `Merged [${sortedLeft.join(', ')}] and [${sortedRight.join(', ')}] into [${merged.join(', ')}].`,
        null,
        null,
        null,
        merged
      );
    };

    // Start sorting
    mergeSort(
      array,
      0,
      array.length - 1,
      root.id,
      0,
      0
    );

    // Final sorted array
    saveStep(
      array,
      this.range(0, array.length - 1),
      array,
      [],
      'complete',
      'All subarrays have been merged. The entire array is sorted!',
      null,
      null,
      null,
      array
    );

    this.steps.set(generatedSteps);
    this.stepIndex.set(0);
  }

  private range(start: number, end: number): number[] {
    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }

  nextStep(): void {
    if (!this.isLastStep()) {
      this.stepIndex.update(index => index + 1);
    }
  }

  previousStep(): void {
    if (!this.isFirstStep()) {
      this.stepIndex.update(index => index - 1);
    }
  }

  reset(): void {
    this.stepIndex.set(0);
  }

  restart(): void {
    this.values.set([...this.defaultValues]);
    this.buildSteps();
  }

  setCustomArray(rawValue: string): void {
    const parsed = rawValue
      .split(',')
      .map(value => Number(value.trim()));

    if (
      parsed.length < 2 ||
      parsed.length > 12 ||
      parsed.some(value => !Number.isInteger(value))
    ) {
      return;
    }

    this.values.set(parsed);
    this.buildSteps();
  }
}
