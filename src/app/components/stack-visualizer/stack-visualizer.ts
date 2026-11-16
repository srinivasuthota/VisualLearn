import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-stack-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack-visualizer.html',
  styleUrl: './stack-visualizer.css'
})
export class StackVisualizerComponent {

  readonly capacity = 8;

  stack = signal<number[]>([]);
  operationCount = signal(0);
  message = signal('Stack is empty. Push an element to begin.');
  lastOperation = signal('Ready');

  topValue = computed(() => {
    const items = this.stack();
    return items.length > 0 ? items[items.length - 1] : null;
  });

  pushValue(rawValue: string): void {
    if (rawValue.trim() === '') {
      this.message.set('Please enter a number.');
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      this.message.set('Please enter a valid number.');
      return;
    }

    if (this.stack().length >= this.capacity) {
      this.message.set('Stack is full! Cannot push more elements.');
      return;
    }

    this.stack.update(items => [...items, value]);
    this.operationCount.update(count => count + 1);

    this.lastOperation.set(`Pushed ${value}`);
    this.message.set(`${value} was added to the top of the stack.`);
  }

  pop(): void {
    const items = this.stack();

    if (items.length === 0) {
      this.message.set('Stack Underflow! There are no elements to remove.');
      return;
    }

    const removedValue = items[items.length - 1];

    this.stack.set(items.slice(0, -1));
    this.operationCount.update(count => count + 1);

    this.lastOperation.set(`Popped ${removedValue}`);
    this.message.set(`${removedValue} was removed from the stack.`);
  }

  peek(): void {
    const value = this.topValue();

    if (value === null) {
      this.message.set('Stack is empty. Nothing to peek.');
      return;
    }

    this.lastOperation.set('Peek');
    this.message.set(`The top element is ${value}. It remains in the stack.`);
  }

  reset(): void {
    this.stack.set([]);
    this.operationCount.set(0);
    this.lastOperation.set('Reset');
    this.message.set('Stack cleared. Start again!');
  }
}