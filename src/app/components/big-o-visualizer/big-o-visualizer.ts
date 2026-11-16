
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface Complexity {
  id: string;
  name: string;
  description: string;
  calculate: (n: number) => number;
}

@Component({
  selector: 'app-big-o-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './big-o-visualizer.html',
  styleUrl: './big-o-visualizer.css'
})
export class BigOVisualizerComponent {

  inputSize = signal(10);
  selectedComplexity = signal('n');

  complexities: Complexity[] = [
    {
      id: '1',
      name: 'O(1)',
      description: 'Constant time: the number of operations stays the same.',
      calculate: () => 1
    },
    {
      id: 'logn',
      name: 'O(log n)',
      description: 'Logarithmic time: operations grow slowly as input increases.',
      calculate: n => Math.log2(n)
    },
    {
      id: 'n',
      name: 'O(n)',
      description: 'Linear time: operations grow proportionally to input size.',
      calculate: n => n
    },
    {
      id: 'nlogn',
      name: 'O(n log n)',
      description: 'Linearithmic time: common in efficient sorting algorithms.',
      calculate: n => n * Math.log2(n)
    },
    {
      id: 'n2',
      name: 'O(n²)',
      description: 'Quadratic time: operations grow with the square of input size.',
      calculate: n => n * n
    },
    {
      id: '2n',
      name: 'O(2ⁿ)',
      description: 'Exponential time: operations double with each additional input.',
      calculate: n => Math.pow(2, n)
    }
  ];

  readonly chart = {
    width: 700,
    height: 340,
    left: 55,
    right: 670,
    top: 25,
    bottom: 285,
    maxOperations: 1000
  };

  selectedDetails = computed(() => {
    const complexity = this.complexities.find(
      item => item.id === this.selectedComplexity()
    );

    const operations = complexity
      ? complexity.calculate(this.inputSize())
      : 0;

    return {
      name: complexity?.name ?? '',
      description: complexity?.description ?? '',
      operations: Math.ceil(operations)
    };
  });

  chartLines = computed(() => {
    const maxN = 20;
    const { left, right, top, bottom, maxOperations } = this.chart;

    return this.complexities.map(complexity => {
      const points = [];

      for (let n = 1; n <= maxN; n++) {
        const operations = complexity.calculate(n);

        const x = left + ((n - 1) / (maxN - 1)) * (right - left);

        const y = bottom -
          (Math.min(operations, maxOperations) / maxOperations) *
          (bottom - top);

        points.push(`${x},${y}`);
      }

      return {
        id: complexity.id,
        name: complexity.name,
        points: points.join(' ')
      };
    });
  });

  getOperations(complexityId: string): number {
    const complexity = this.complexities.find(
      item => item.id === complexityId
    );

    return complexity
      ? Math.ceil(complexity.calculate(this.inputSize()))
      : 0;
  }

  selectComplexity(id: string): void {
    this.selectedComplexity.set(id);
  }

  updateInputSize(value: number): void {
    this.inputSize.set(value);
  }

}
