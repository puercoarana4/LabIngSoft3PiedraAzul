import { booleanAttribute, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'atom-input-text',
  standalone: true,
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() maxLength: number | null = null;
  @Input() min: number | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;

  value: string | number = '';
  private onChange: (value: string | number | undefined) => void = () => {};
  private onTouched: () => void = () => {};

  get controlId(): string {
    return this.id ? `${this.id}-control` : '';
  }

  writeValue(value: string | number | null | undefined): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string | number | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.type === 'number') {
      this.value = input.value === '' ? '' : input.valueAsNumber;
      this.onChange(input.value === '' ? undefined : input.valueAsNumber);
      return;
    }
    this.value = input.value;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
