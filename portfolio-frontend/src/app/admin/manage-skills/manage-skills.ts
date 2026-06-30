import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillList } from './skill-list/skill-list';
import { SkillForm } from './skill-form/skill-form';
import { SkillService } from '../../core/services/skill.service';
import { SkillCategory } from '../../core/models/skill.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-skills',
  standalone: true,
  imports: [CommonModule, SkillList, SkillForm],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.css'
})
export class ManageSkills implements OnInit {
  skills: SkillCategory[] = [];
  isLoading = true;
  errorMessage = '';
  showForm = false;
  editingSkill: SkillCategory | null = null;

  constructor(
    private skillService: SkillService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadSkills(); }

  loadSkills(): void {
    this.isLoading = true;
    this.skillService.getSkills().subscribe({
      next: (data) => {
        this.skills = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load skills.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddNew(): void {
    this.editingSkill = null;
    this.showForm = true;
  }

  onEdit(skill: SkillCategory): void {
    this.editingSkill = skill;
    this.showForm = true;
  }

  onDelete(id: string): void {
    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.toast.success('Skill category deleted.');
        this.loadSkills();
      },
      error: () => this.toast.error('Failed to delete skill category.')
    });
  }

  onFormSaved(skill: SkillCategory): void {
    const index = this.skills.findIndex(s => s._id === skill._id);
    if (index > -1) {
      this.skills[index] = skill;
      this.toast.success('Skill category updated.');
    } else {
      this.skills.unshift(skill);
      this.toast.success('Skill category created.');
    }
    this.showForm = false;
    this.cdr.detectChanges();
  }

  onFormCancel(): void {
    this.showForm = false;
    this.editingSkill = null;
  }
}