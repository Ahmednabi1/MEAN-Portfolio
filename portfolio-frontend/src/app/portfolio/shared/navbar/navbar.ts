import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  fullName = 'Portfolio'; //placeholder for user's name
  isMenuOpen = false;  // for mobile menu  (html)

  navLinks = [          // for html
    { label: 'About',      href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects',   href: '#projects' },
    { label: 'Skills',     href: '#skills' },
    { label: 'Contact',    href: '#contact' },
  ];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({  //won't unsubscribe because this is a singleton service and the component will be destroyed when navigating away from the page unlike toast 
      next: (p) => this.fullName = p.fullName, 
      error: () => {}
    });
  }

  scrollTo(href: string): void {   // for html
    this.isMenuOpen = false;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  toggleMenu(): void {    //for html
    this.isMenuOpen = !this.isMenuOpen;
  }
}