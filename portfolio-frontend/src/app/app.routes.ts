import { Routes } from '@angular/router';
import { Portfolio } from './portfolio/portfolio';
import { Login } from './admin/login/login';
import { Admin } from './admin/admin';
import { Dashboard } from './admin/dashboard/dashboard';
import { ManageProfile } from './admin/manage-profile/manage-profile';
import { ManageProjects } from './admin/manage-projects/manage-projects';
import { ManageExperience } from './admin/manage-experience/manage-experience';
import { ManageSkills } from './admin/manage-skills/manage-skills';
import { NotFound } from './shared/not-found/not-found';
import { Home } from './portfolio/pages/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Messages } from './admin/messages/messages';

export const routes: Routes = [
  { path: '', component: Portfolio, children: 
    [{ path: '', component: Home }] 
  },

  
  { path: 'admin/login', component: Login },


  {
    path: 'admin', component: Admin, canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'profile', component: ManageProfile },
      { path: 'projects', component: ManageProjects },
      { path: 'experience', component: ManageExperience },
      { path: 'skills', component: ManageSkills },
      { path: 'messages', component: Messages },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },


  { path: '**', component: NotFound }
];