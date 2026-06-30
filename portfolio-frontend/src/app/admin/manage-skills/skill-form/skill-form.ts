import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SkillCategory } from '../../../core/models/skill.model';
import { SkillService } from '../../../core/services/skill.service';
import { TextValidators } from '../.../../../../core/custom-validator/text.validators'
@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.css'
})
export class SkillForm implements OnInit, OnChanges {
  @Input() skill: SkillCategory | null = null;
  @Output() saved = new EventEmitter<SkillCategory>();
  @Output() cancelled = new EventEmitter<void>();

  skillForm!: FormGroup;
  isSaving = false;
  errorMessage = '';

  iconSuggestions = [
    { label: 'Code', value: 'fas fa-code' },
    { label: 'Server', value: 'fas fa-server' },
    { label: 'Database', value: 'fas fa-database' },
    { label: 'Cloud', value: 'fas fa-cloud' },
    { label: 'Tools', value: 'fas fa-tools' },
    { label: 'Mobile', value: 'fas fa-mobile-alt' },
    { label: 'Brain', value: 'fas fa-brain' },
    { label: 'Shield', value: 'fas fa-shield-alt' },
    { label: 'Globe', value: 'fas fa-globe' },
    { label: 'Terminal', value: 'fas fa-terminal' },
    { label: 'Cogs', value: 'fas fa-cogs' },
    { label: 'Chart', value: 'fas fa-chart-bar' },
  ];

  constructor(private skillService: SkillService) { }

  ngOnInit(): void {
    this.skillForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        TextValidators.noWhitespace(),
        TextValidators.minLengthTrimmed(2)
      ]),
      icon: new FormControl('fas fa-code', [Validators.required]),
      tagsText: new FormControl(''),
      order: new FormControl(0, [TextValidators.positiveNumber()])
    });

    // skill may already be set before ngOnInit fires
    if (this.skill) this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skill'] && this.skillForm) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (!this.skill) {
      this.skillForm.reset({ icon: 'fas fa-code', order: 0 });
      return;
    }
    this.skillForm.setValue({
      name: this.skill.name,
      icon: this.skill.icon,
      tagsText: this.skill.tags.join(', '),
      order: this.skill.order
    });
  }

  get name() { return this.skillForm.get('name')!; }
  get icon() { return this.skillForm.get('icon')!; }
  get tagsText() { return this.skillForm.get('tagsText')!; }

  selectIcon(value: string): void {
    this.skillForm.patchValue({ icon: value });
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const tags = this.tagsText.value
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t);

    const body: Partial<SkillCategory> = {
      name: this.name.value.trim(),
      icon: this.icon.value,
      tags,
      order: this.skillForm.get('order')?.value
    };

    const request$ = this.skill?._id
      ? this.skillService.updateSkill(this.skill._id, body)
      : this.skillService.createSkill(body);

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