import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../../core/models/experience.model';

@Component({
  selector: 'app-experience-list',
  imports: [CommonModule],
  templateUrl: './experience-list.html',
  styleUrl: './experience-list.css'
})
export class ExperienceList {
  @Input() experiences: Experience[] = [];
  @Output() edit = new EventEmitter<Experience>();
  @Output() delete = new EventEmitter<string>();

  onEdit(experience: Experience): void {
    this.edit.emit(experience);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }
}