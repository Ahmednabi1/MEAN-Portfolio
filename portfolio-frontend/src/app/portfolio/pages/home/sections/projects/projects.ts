import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCard } from './project-card/project-card';
import { ProjectService } from '../../../../../core/services/project.service';
import { Project } from '../../../../../core/models/project.model';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: () => {}
    });
  }
}