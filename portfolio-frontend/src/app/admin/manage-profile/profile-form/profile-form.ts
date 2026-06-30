import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Profile } from '../../../core/models/profile.model';
import { ProfileService } from '../../../core/services/profile.service';
import { TextValidators } from '../../../core/custom-validator/text.validators';
import { ContactValidators } from '../../../core/custom-validator/contact.validators';
import { UrlValidators } from '../../../core/custom-validator/url.validators';

@Component({
  selector: 'app-profile-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css'
})
export class ProfileForm implements OnInit, OnChanges {
  @Input() profile: Profile | null = null;
  @Output() profileSaved = new EventEmitter<Profile>();

  profileForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;  // array buffer to support image preview
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private profileService: ProfileService) {}

ngOnInit(): void {
  this.profileForm = new FormGroup({
    fullName:            new FormControl('', [Validators.required, TextValidators.noWhitespace(), TextValidators.minLengthTrimmed(3)]),
    heroEyebrow:         new FormControl('', [Validators.required, TextValidators.noWhitespace()]),
    heroSubtitle:        new FormControl('', [Validators.required, TextValidators.noWhitespace()]),
    role:                new FormControl('', [Validators.required, TextValidators.noWhitespace()]),
    email:               new FormControl('', [Validators.required, ContactValidators.validEmail()]),
    phone:               new FormControl('', [ContactValidators.validPhone()]),
    location:            new FormControl(''),
    graduationInfo:      new FormControl(''),
    linkedinUrl:         new FormControl('', [UrlValidators.validUrl()]),
    githubUrl:           new FormControl('', [UrlValidators.validUrl()]),
    resumeDownloadUrl:   new FormControl('', [UrlValidators.validUrl()]),
    resumeViewUrl:       new FormControl('', [UrlValidators.validUrl()]),
    aboutText:           new FormControl('', [TextValidators.noWhitespace()]),
    eduDegree:           new FormControl(''),
    eduInstitution:      new FormControl(''),
    eduMeta:             new FormControl(''),
    eduAchievementTitle: new FormControl(''),
    eduAchievementDescription: new FormControl(''),
    eduAchievementItemsText:   new FormControl('')
  });

  // profile may already be set before ngOnInit fires which without caused the form to not populate with the profile data so we check and populate here as well.
  if (this.profile) {
    this.populateForm(this.profile);
  }
}

ngOnChanges(changes: SimpleChanges): void {       //onchanges runs immediately each time the input property changes needed to populate the form when the profile input changes.
  if (changes['profile'] && this.profile && this.profileForm) {
    this.populateForm(this.profile);
  }
}

  private populateForm(p: Profile): void {
    this.profileForm.patchValue({
      fullName:            p.fullName,
      heroEyebrow:         p.heroEyebrow,
      heroSubtitle:        p.heroSubtitle,
      role:                p.role,
      email:               p.email,
      phone:               p.phone,
      location:            p.location,
      graduationInfo:      p.graduationInfo,
      linkedinUrl:         p.linkedinUrl,
      githubUrl:           p.githubUrl,
      resumeDownloadUrl:   p.resumeDownloadUrl,
      resumeViewUrl:       p.resumeViewUrl,
      aboutText:           p.aboutParagraphs.join('\n\n'),  // join paragraphs with double newlines for readabilty
      eduDegree:           p.education.degree,
      eduInstitution:      p.education.institution,
      eduMeta:             p.education.meta,
      eduAchievementTitle: p.education.achievementTitle,
      eduAchievementDescription: p.education.achievementDescription,
      eduAchievementItemsText:   p.education.achievementItems.join('\n')    // join achievement items with newline for better readabilty
    });
    this.previewUrl = p.profilePicture ? `http://localhost:5000${p.profilePicture}` : null;
  }
//____________________________________________________________________________________________________
  get fullName()          { return this.profileForm.get('fullName')!; }
  get heroEyebrow()       { return this.profileForm.get('heroEyebrow')!; }
  get heroSubtitle()      { return this.profileForm.get('heroSubtitle')!; }
  get role()              { return this.profileForm.get('role')!; }
  get email()             { return this.profileForm.get('email')!; }
  get phone()             { return this.profileForm.get('phone')!; }
  get linkedinUrl()       { return this.profileForm.get('linkedinUrl')!; }
  get githubUrl()         { return this.profileForm.get('githubUrl')!; }
  get resumeDownloadUrl() { return this.profileForm.get('resumeDownloadUrl')!; }
  get resumeViewUrl()     { return this.profileForm.get('resumeViewUrl')!; }
  get aboutText()         { return this.profileForm.get('aboutText')!; }

  onFileChange(event: Event): void {     // like ngonchanges called each time a file is selected to render the preview
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const v = this.profileForm.value;
    const formData = new FormData();

    formData.append('fullName',       v.fullName.trim());
    formData.append('heroEyebrow',    v.heroEyebrow.trim());
    formData.append('heroSubtitle',   v.heroSubtitle.trim());
    formData.append('role',           v.role.trim());
    formData.append('email',          v.email.trim());
    formData.append('phone',          v.phone ?? '');
    formData.append('location',       v.location ?? '');
    formData.append('graduationInfo', v.graduationInfo ?? '');
    formData.append('linkedinUrl',    v.linkedinUrl ?? '');
    formData.append('githubUrl',      v.githubUrl ?? '');
    formData.append('resumeDownloadUrl', v.resumeDownloadUrl ?? '');
    formData.append('resumeViewUrl',     v.resumeViewUrl ?? '');

    const paragraphs = (v.aboutText as string).split('\n\n').map((p: string) => p.trim()).filter((p: string) => p);
    paragraphs.forEach((p: string) => formData.append('aboutParagraphs[]', p));

    formData.append('education[degree]',               v.eduDegree ?? '');
    formData.append('education[institution]',          v.eduInstitution ?? '');
    formData.append('education[meta]',                 v.eduMeta ?? '');
    formData.append('education[achievementTitle]',     v.eduAchievementTitle ?? '');
    formData.append('education[achievementDescription]', v.eduAchievementDescription ?? '');

    //transforming so it can be sent as an array of strings to the backend.
    const achievementItems = (v.eduAchievementItemsText as string).split('\n').map((i: string) => i.trim()).filter((i: string) => i);
    achievementItems.forEach((i: string) => formData.append('education[achievementItems][]', i));

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }
    
    this.profileService.updateProfile(formData).subscribe({
      next: (updated) => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        this.profileSaved.emit(updated);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Failed to save profile. Please try again.';
      }
    });
  }
}