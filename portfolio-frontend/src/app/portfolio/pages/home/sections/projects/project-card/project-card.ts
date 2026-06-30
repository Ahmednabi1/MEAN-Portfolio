import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  @Input() project!: Project;
  readonly BASE = 'http://localhost:5000';

  currentIndex = 0;           // for tracking the current image index

  get images(): string[] {          //html
    return this.project.images ?? [];       //prevent passing an undefined value to the template
  }

  get hasMultiple(): boolean {        //html
    return this.images.length > 1;
  }

  prev(event: Event): void {
    event.stopPropagation();
    if (this.currentIndex === 0) {
      this.currentIndex = this.images.length - 1;
    } else {
      this.currentIndex--;
    }
  }

  next(event: Event): void {
    event.stopPropagation();
    if (this.currentIndex === this.images.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  goTo(index: number, event: Event): void {
    event.stopPropagation();
    this.currentIndex = index;
  }
}