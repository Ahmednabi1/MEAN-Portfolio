import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/sidebar/sidebar';
import { ToastComponent } from '../shared/toast/toast';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Sidebar, ToastComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  // all for html purposes no logic here
  isSidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean): void { 
    this.isSidebarCollapsed = collapsed;
  }
}