import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasNumber     = /[0-9]+/.test(value);
      const hasUpperCase  = /[A-Z]+/.test(value);
      const hasLowerCase  = /[a-z]+/.test(value);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
      const isValidLength = value.length >= 8;

      const isValid = hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar && isValidLength;
      return !isValid ? { strongPassword: true } : null;
    };
  }

  static passwordMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const password = control.parent?.get('password')?.value;
      return value !== password ? { passwordMatch: true } : null;
    };
  }
}