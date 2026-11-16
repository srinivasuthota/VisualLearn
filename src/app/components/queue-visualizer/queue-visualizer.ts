import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-queue-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './queue-visualizer.html',
  styleUrl: './queue-visualizer.css'
})
export class QueueVisualizerComponent {
  readonly capacity = 8;

  queue = signal<number[]>([]);
  operationCount = signal(0);
  message = signal('Queue is empty. Enqueue an element to begin.');
  lastOperation = signal('Ready');

  frontValue = computed(() => {
    const items = this.queue();
    return items.length > 0 ? items[0] : null;
  });

  rearValue = computed(() => {
    const items = this.queue();
    return items.length > 0 ? items[items.length - 1] : null;
  });

  enqueueValue(rawValue: string): void {
    if (rawValue.trim() === '') {
      this.message.set('Please enter a number.');
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      this.message.set('Please enter a valid number.');
      return;
    }

    if (this.queue().length >= this.capacity) {
      this.message.set('Queue is full! Cannot enqueue more elements.');
      return;
    }

    this.queue.update(items => [...items, value]);
    this.operationCount.update(count => count + 1);

    this.lastOperation.set(`Enqueued ${value}`);
    this.message.set(`${value} was added at the rear of the queue.`);
  }

  dequeue(): void {
    const items = this.queue();

    if (items.length === 0) {
      this.message.set('Queue Underflow! There are no elements to remove.');
      return;
    }

    const removedValue = items[0];

    this.queue.set(items.slice(1));
    this.operationCount.update(count => count + 1);

    this.lastOperation.set(`Dequeued ${removedValue}`);
    this.message.set(`${removedValue} was removed from the front of the queue.`);
  }

  peek(): void {
    const value = this.frontValue();

    if (value === null) {
      this.message.set('Queue is empty. Nothing to peek.');
      return;
    }

    this.lastOperation.set('Peek');
    this.message.set(`The front element is ${value}. It remains in the queue.`);
  }

  reset(): void {
    this.queue.set([]);
    this.operationCount.set(0);
    this.lastOperation.set('Reset');
    this.message.set('Queue cleared. Start again!');
  }
}