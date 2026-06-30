import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Project, ProjectLink } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { TextValidators } from '../../../core/custom-validator/text.validators';
import { UrlValidators } from '../../../core/custom-validator/url.validators';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnInit, OnChanges {
  @Input() project: Project | null = null;
  @Output() saved = new EventEmitter<Project>();
  @Output() cancelled = new EventEmitter<void>();

  readonly BASE = 'http://localhost:5000';

  projectForm!: FormGroup;
  links: ProjectLink[] = [];
  existingImages: string[] = [];
  removedImages: string[] = [];
  newFiles: File[] = [];
  newPreviews: string[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      title: new FormControl('', [Validators.required, TextValidators.noWhitespace(), 
        TextValidators.minLengthTrimmed(3)]),

      description: new FormControl('', [Validators.required,TextValidators.noWhitespace(),
        TextValidators.minLengthTrimmed(10)
      ]),
      badge: new FormControl(''),
      techStackText: new FormControl(''),
      order: new FormControl(0, [TextValidators.positiveNumber()])
    });

    // project may already be set before ngOnInit fires(in case of editing existing project)
    if (this.project) {
      this.resetExtras();
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.projectForm) {
      this.resetExtras();
      this.populateForm();
    }
  }

  private resetExtras(): void {       //  resets those fields so user won't delete an item by mistake and to free them in case of editing another project
    this.links = [];
    this.existingImages = [];
    this.removedImages = [];
    this.newFiles = [];
    this.newPreviews = [];
    this.errorMessage = '';
  }

  private populateForm(): void {   //fill form with existing data
    if (!this.project) {
      this.projectForm.reset({ order: 0 });
      return;
    }
    this.projectForm.setValue({
      title: this.project.title,
      description: this.project.description,
      badge: this.project.badge,
      techStackText: this.project.techStack.join(', '),
      order: this.project.order
    });
    this.links = this.project.links.map(l => ({ ...l }));
    this.existingImages = [...this.project.images];
  }

  get title() { return this.projectForm.get('title')!; }
  get description() { return this.projectForm.get('description')!; }
  get techStackText() { return this.projectForm.get('techStackText')!; }

  addLink(): void { this.links.push({ label: '', url: '' }); }
  removeLink(index: number): void { this.links.splice(index, 1); }

  // Images 
  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      this.newFiles.push(file);
      const reader = new FileReader(); //for preview
      reader.onload = () => this.newPreviews.push(reader.result as string);
      reader.readAsDataURL(file);         //html
    });
    input.value = '';
  }

  removeExistingImage(index: number): void {    //why push then splice
    this.removedImages.push(this.existingImages[index]);
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newFiles.splice(index, 1);
    this.newPreviews.splice(index, 1);
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('title', this.title.value.trim());
    formData.append('description', this.description.value.trim());
    formData.append('badge', this.projectForm.get('badge')?.value ?? '');
    formData.append('order', this.projectForm.get('order')?.value.toString());
    formData.append('removeImages', JSON.stringify(this.removedImages));

    formData.append('techStack', JSON.stringify(
      this.techStackText.value.split(',').map((t: string) => t.trim()).filter((t: string) => t)
    ));

    formData.append('links', JSON.stringify(this.links));

    this.existingImages.forEach(img => formData.append('existingImages[]', img));
    this.newFiles.forEach(file => formData.append('images', file));

    //has id -> update, no id -> create
    const request$ = this.project?._id ? this.projectService.updateProject(this.project._id, formData)
      : this.projectService.createProject(formData);

    request$.subscribe({
      next: (result) => {
        this.isSaving = false;
        this.saved.emit(result);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Failed to save project.';
      }
    });
  }

  onCancel(): void { 
    this.cancelled.emit(); 
  }
}