import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-controls',
  standalone: true,
  template: `
    <div class="playback-row">
      <button class="control-button secondary-control" [disabled]="currentIndex <= 0" (click)="goTo(currentIndex - 1)">← Previous</button>
      <div class="step-dots">
        @for (step of stepNumbers; track step) {
          <button [attr.aria-label]="'Go to step ' + (step + 1)" [class.active-dot]="currentIndex === step" (click)="goTo(step)"></button>
        }
      </div>
      <button class="control-button primary-control" [disabled]="currentIndex >= totalSteps - 1" (click)="goTo(currentIndex + 1)">Next step →</button>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .playback-row{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f0f1f5;padding-top:15px;gap:8px}
    .control-button{border:0;border-radius:8px;padding:10px 13px;font:inherit;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap}
    .control-button:disabled{opacity:.4;cursor:not-allowed}
    .secondary-control{background:#f2f3f8;color:#666b7c}
    .primary-control{background:#6659d9;color:white}
    .step-dots{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap}
    .step-dots button{width:7px;height:7px;border:0;border-radius:10px;padding:0;background:#d9dbe5;cursor:pointer}
    .step-dots button.active-dot{width:18px;background:#6659d9}
    @media(max-width:520px){.playback-row{flex-wrap:wrap}.step-dots{order:3;width:100%}}
  `]
})
export class StepControlsComponent {
  @Input() totalSteps = 0;
  @Input() currentIndex = 0;
  @Output() indexChange = new EventEmitter<number>();

  get stepNumbers(): number[] {
    return Array.from({ length: this.totalSteps }, (_, index) => index);
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.totalSteps) this.indexChange.emit(index);
  }
}
