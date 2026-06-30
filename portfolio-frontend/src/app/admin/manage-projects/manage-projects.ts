import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectList } from './project-list/project-list';
import { ProjectForm } from './project-form/project-form';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-projects',
  imports: [CommonModule, ProjectList, ProjectForm],
  templateUrl: './manage-projects.html',
  styleUrl: './manage-projects.css'
})
export class ManageProjects implements OnInit {
  projects: Project[] = [];
  isLoading = true;
  errorMessage = '';
  showForm = false;
  editingProject: Project | null = null;

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef, private toast: ToastService) { }

  ngOnInit(): void { 
    this.loadProjects(); 
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load projects.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddNew(): void {
    this.editingProject = null;
    this.showForm = true;
  }

  onEdit(project: Project): void {
    this.editingProject = project;
    this.showForm = true;
  }

  onDelete(id: string): void {
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.toast.success('Project deleted.');
        this.loadProjects();
      },
      error: () => this.toast.error('Failed to delete project.')
    });
  }

  onFormSaved(project: Project): void {
    const index = this.projects.findIndex(p => p._id === project._id);

    if (index > -1) {
      this.projects[index] = project;
      this.toast.success('Project updated.');
    } 
    else {
      this.projects.unshift(project);
      this.toast.success('Project created.');
    }
    this.showForm = false;
  }

  onFormCancel(): void {
    this.showForm = false;
    this.editingProject = null;
  }
}


/*
workflow:

user clicks edit -> projectlist emits(project) -> parent sets editingproject + showdorm -> 
projectform receives project via @input -> ngonchanges populates form -> user edits and clicks save 
-> form emits(saved project) -> parent updates projects[] (update if exist or add new)

delete flow:

user click delete -> projectlist rmits(id) -> parent calls delete api -> 
on success parent reloads projects using loadprojects() from service -> projectlist updates.

data flow:

parent -> passes projects[] to projectlist
parent -> passes editingproject to projectform

event flow:

projectlist -> emits edit/delete -> parent handles
projectform -> emits saved/cancelled -> parent handles
*/
