import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

type Errors = string[];

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
})
export class InputTextComponent {
  @Input() searchText: string | undefined;

  @Input() error: string | null = null;
  @Input() errors: Errors | undefined;

  formFieldsErrors: string[] = [];

  get errorsArray(): string[] {
    if (!this.errors) {
      return this.formFieldsErrors;
    }
    return this.errors.concat(this.formFieldsErrors);
  }
}
