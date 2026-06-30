import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class UrlValidators {

  static validUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      try {
        new URL(control.value);  // new URL parses the string and throws if it's not a valid URL
        return null;
      } catch {
        return { validUrl: true };
      }
    };
  }
}