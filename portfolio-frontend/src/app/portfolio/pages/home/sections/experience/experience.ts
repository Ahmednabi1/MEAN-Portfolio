import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceService } from '../../../../../core/services/experience.service';
import { Experience as ExperienceModel } from './../../../../../core/models/experience.model';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class Experience implements OnInit {
  experiences: ExperienceModel[] = [];

  constructor(private experienceService: ExperienceService) { }

  ngOnInit(): void {
    this.experienceService.getExperience().subscribe({
      next: (data) => this.experiences = data,
      error: () => { }
    });
  }
}