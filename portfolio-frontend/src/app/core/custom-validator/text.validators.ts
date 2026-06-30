import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TextValidators {

  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if ((control.value || '').trim().length === 0) {
        return { noWhitespace: true };              //user entered just white spaces
      } 
      return null;
    };
  }

  static minLengthTrimmed(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      if (control.value.trim().length >= min) {
        return null;
      } 
      else {
        return {
          minLengthTrimmed: {
            requiredLength: min,
            actualLength: control.value.trim().length
          }
        };
      }
    };
  }

  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      if (control.value.length <= max) {
        return null;
      } 
      else {
        return {
          maxLength: {
            requiredLength: max,
            actualLength: control.value.length
          }
        };
      }
    };
  }

  static noSpecialChars(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const pattern = /^[a-zA-Z0-9\s\-'.،أ-ي]+$/;

      if (pattern.test(control.value)) {
        return null;
      } 
      else {
        return { noSpecialChars: true };
      }
    };
  }

  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') return null;

      if (Number(control.value) >= 0) {
        return null;
      } 
      else {
        return { positiveNumber: true };
      }
    };
  }
}