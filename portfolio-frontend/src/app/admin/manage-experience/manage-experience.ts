import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceList } from './experience-list/experience-list';
import { ExperienceForm } from './experience-form/experience-form';
import { ExperienceService } from '../../core/services/experience.service';
import { Experience } from '../../core/models/experience.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-experience',
  imports: [CommonModule, ExperienceList, ExperienceForm],
  templateUrl: './manage-experience.html',
  styleUrl: './manage-experience.css'
})
export class ManageExperience implements OnInit {
  experiences: Experience[] = [];
  isLoading = true;
  errorMessage = '';
  showForm = false;
  editingExperience: Experience | null = null;

  constructor(private experienceService: ExperienceService, private cdr: ChangeDetectorRef, private toast: ToastService) { }

  ngOnInit(): void { 
    this.loadExperience(); 
  }

  loadExperience(): void {
    this.isLoading = true;
    this.experienceService.getExperience().subscribe({
      next: (data) => {this.experiences = data;this.isLoading = false;this.cdr.detectChanges();},
      error: () => {
        this.errorMessage = 'Failed to load experience.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddNew(): void {
    this.editingExperience = null;
    this.showForm = true;
  }

  onEdit(experience: Experience): void {
    this.editingExperience = experience;
    this.showForm = true;
  }

  onDelete(id: string): void {
    this.experienceService.deleteExperience(id).subscribe({
      next: () => {
        this.toast.success('Experience deleted.');
        this.loadExperience();
      },
      error: () => this.toast.error('Failed to delete experience.')
    });
  }

  onFormSaved(experience: Experience): void {
    const index = this.experiences.findIndex(e => e._id === experience._id);
    
    if (index > -1) {
      this.experiences[index] = experience;
      this.toast.success('Experience updated.');
    } else {
      this.experiences.unshift(experience);
      this.toast.success('Experience created.');
    }
    this.showForm = false;
    this.cdr.detectChanges();
  }

  onFormCancel(): void {
    this.showForm = false;
    this.editingExperience = null;
  }
}