import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Output('onClick')
  clickEmitter: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    this.clickEmitter.emit();
  }
}
