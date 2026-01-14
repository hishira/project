import { ChangeDetectionStrategy, Component, computed, input, signal, Signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatButtonModule],
})
export class PasswordInputComponent {
  readonly control = input.required<FormControl>();
  readonly label = input.required<string>();
  readonly placeholder = input<string>('Enter your password');
  readonly hidePassword: WritableSignal<boolean> = signal(true);
  readonly isLoading: WritableSignal<boolean> = signal(false);
  readonly passwordType: Signal<'password' | 'text'> = computed(() => (this.hidePassword() ? 'password' : 'text'));
  readonly passwordIcon: Signal<'visibility_off' | 'visibility'> = computed(() =>
    this.hidePassword() ? 'visibility_off' : 'visibility',
  );

  passwordHide(): void {
    this.hidePassword.update((hide) => !hide);
  }
}
