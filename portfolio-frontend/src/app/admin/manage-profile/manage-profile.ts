import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileForm } from './profile-form/profile-form';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../core/models/profile.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-profile',
  imports: [CommonModule, ProfileForm],
  templateUrl: './manage-profile.html',
  styleUrl: './manage-profile.css'
})
export class ManageProfile implements OnInit {
  profile: Profile | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private profileService: ProfileService, private cdr: ChangeDetectorRef, private toast: ToastService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        // console.log('profile data from api : ', data)

        this.profile = data;
        this.isLoading = false;
        this.cdr.detectChanges(); //fixes the double click loading issue
        // this.toast.success('Profile loaded.');
      },
      error: () => {
        // this.errorMessage = 'Failed to load profile.';
        this.isLoading = false;
        // this.toast.error('Failed to load prodile');
      }
    });
  }

  onProfileSaved(updated: Profile): void {
    this.profile = updated;
    this.toast.success('Profile Saved.')
  }
}