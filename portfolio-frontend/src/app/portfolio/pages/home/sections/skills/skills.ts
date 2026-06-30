import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillService } from '../../../../../core/services/skill.service';
import { SkillCategory } from '../../../../../core/models/skill.model';


@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills implements OnInit {
  skillCategories: SkillCategory[] = [];

  constructor(private skillService: SkillService) {}

  ngOnInit(): void {
    this.skillService.getSkills().subscribe({
      next: (data) => this.skillCategories = data,
      error: () => {}
    });
  }
}