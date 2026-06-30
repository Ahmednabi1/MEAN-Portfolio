import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCategory } from '../../../core/models/skill.model';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-list.html',
  styleUrl: './skill-list.css'
})
export class SkillList {
  @Input() skills: SkillCategory[] = [];
  @Output() edit = new EventEmitter<SkillCategory>();
  @Output() delete = new EventEmitter<string>();

  onEdit(skill: SkillCategory): void { this.edit.emit(skill); }
  onDelete(id: string): void { this.delete.emit(id); }
}