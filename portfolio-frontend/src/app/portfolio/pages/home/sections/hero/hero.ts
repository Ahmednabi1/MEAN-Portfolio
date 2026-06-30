import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../../core/services/profile.service';
import { Profile } from '../../../../../core/models/profile.model';


@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero implements OnInit {
  profile: Profile | null = null;
  readonly BASE = 'http://localhost:5000';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (p) => this.profile = p,
      error: () => {}
    });
  }

  scrollTo(href: string): void {      //html
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}