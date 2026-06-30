import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectList {
  @Input() projects: Project[] = [];
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<string>();

  readonly BASE = 'http://localhost:5000';

  onEdit(project: Project): void {
    this.edit.emit(project);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  getCoverImage(project: Project): string | null {
    return project.images?.length ? `${this.BASE}${project.images[0]}` : null;  //return first image as cover if not found return null to prevent passing an undefined
  }
}