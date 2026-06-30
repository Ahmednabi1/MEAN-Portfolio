import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Experience } from '../../../core/models/experience.model';
import { ExperienceService } from '../../../core/services/experience.service';
import { TextValidators } from '../../../core/custom-validator/text.validators';

@Component({
  selector: 'app-experience-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience-form.html',
  styleUrl: './experience-form.css'
})
export class ExperienceForm implements OnInit, OnChanges {
  @Input() experience: Experience | null = null;
  @Output() saved = new EventEmitter<Experience>();
  @Output() cancelled = new EventEmitter<void>();

  experienceForm!: FormGroup;
  isSaving = false;
  errorMessage = '';

  constructor(private experienceService: ExperienceService) { }

  ngOnInit(): void {
    this.experienceForm = new FormGroup({
      role: new FormControl('', [Validators.required, TextValidators.noWhitespace(),
      TextValidators.minLengthTrimmed(3)]),

      company: new FormControl('', [Validators.required, TextValidators.noWhitespace(),
      TextValidators.minLengthTrimmed(3)]),

      description: new FormControl('', [Validators.required,TextValidators.noWhitespace(),
        TextValidators.minLengthTrimmed(10)]),

      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl(''),
      isCurrent: new FormControl(false),
      order: new FormControl(0, [TextValidators.positiveNumber()])
    });

    this.experienceForm.get('isCurrent')?.valueChanges.subscribe((checked: boolean) => {
      const endDate = this.experienceForm.get('endDate');

      if (checked) {
        endDate?.clearValidators();
        endDate?.setValue('');
      } 
      else {
        endDate?.setValidators([Validators.required]);
      }
      endDate?.updateValueAndValidity();
    });

    // experience may already be set before ngOnInit fires
    if (this.experience) this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experience'] && this.experienceForm) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (!this.experience) {
      this.experienceForm.reset({ order: 0, isCurrent: false });
      return;
    }

    const parts = this.experience.dateRange.split('–').map(s => s.trim());
    const startDate = this.labelToInputValue(parts[0] ?? '');
    const isCurrent = parts[1] === 'Present';
    const endDate = isCurrent ? '' : this.labelToInputValue(parts[1] ?? '');  

    this.experienceForm.setValue({
      role: this.experience.role,
      company: this.experience.company,
      description: this.experience.description,
      order: this.experience.order,
      startDate,
      endDate,
      isCurrent
    });
  }
//_______________________________________________________________________
  private labelToInputValue(label: string): string {    //"July 2026" → 2026-07
    const months: Record<string, string> = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const [mon, year] = label.split(' ');

    if (!months[mon] || !year) return '';

    return `${year}-${months[mon]}`;
  }

  private inputValueToLabel(value: string): string {   //opposite
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, month] = value.split('-');

    if (!year || !month) return '';

    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  }

  private buildDateRange(): string {
    const start = this.inputValueToLabel(this.experienceForm.get('startDate')?.value);
    const end = this.experienceForm.get('isCurrent')?.value ? 'Present'
      : this.inputValueToLabel(this.experienceForm.get('endDate')?.value);
      
    return `${start} – ${end}`;
  }

  get role() { return this.experienceForm.get('role')!; }
  get company() { return this.experienceForm.get('company')!; }
  get description() { return this.experienceForm.get('description')!; }
  get startDate() { return this.experienceForm.get('startDate')!; }
  get endDate() { return this.experienceForm.get('endDate')!; }
  get isCurrent() { return this.experienceForm.get('isCurrent')!; }

  onSubmit(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const body: Partial<Experience> = {
      role: this.role.value.trim(),
      company: this.company.value.trim(),
      dateRange: this.buildDateRange(),
      description: this.description.value.trim(),
      order: this.experienceForm.get('order')?.value
    };

    const request$ = this.experience?._id ? this.experienceService.updateExperience(this.experience._id, body)
      : this.experienceService.createExperience(body);

    request$.subscribe({
      next: (result) => {
        this.isSaving = false;
        this.saved.emit(result);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Failed to save. Please try again.';
      }
    });
  }

  onCancel(): void { this.cancelled.emit(); }
}