import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ContactValidators {

  static validEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(control.value) ? null : { validEmail: true };
    };
  }

  static validPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const pattern = /^01[0125][0-9]{8}$/gm;     // EGY 010123456789
      return pattern.test(control.value) ? null : { validPhone: true };
    };
  }
}