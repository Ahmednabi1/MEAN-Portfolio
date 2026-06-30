import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  //html
  @Output() toggleCollapse = new EventEmitter<boolean>();

  isCollapsed = false;

  navItems = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/admin/dashboard' },
    { label: 'Profile', icon: 'fas fa-user', route: '/admin/profile' },
    { label: 'Projects', icon: 'fas fa-folder-open', route: '/admin/projects' },
    { label: 'Experience', icon: 'fas fa-briefcase', route: '/admin/experience' },
    { label: 'Skills', icon: 'fas fa-code', route: '/admin/skills' },
    { label: 'Messages', icon: 'fas fa-envelope', route: '/admin/messages' },
  ];
  constructor(private auth: AuthService) { }

  toggle(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleCollapse.emit(this.isCollapsed);
  }
//______
  logout(): void {
    this.auth.logout();
  }
}