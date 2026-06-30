import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';
import { MessageService } from '../../../../../core/services/message.service';
import { TextValidators } from '../../../../../core/custom-validator/text.validators';
import { ContactValidators } from '../../../../../core/custom-validator/contact.validators';
import { Profile } from '../../../../../core/models/profile.model';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  profile: Profile | null = null;
  contactForm!: FormGroup;
  isSending = false;   // html
  submitted = false;
  errorMessage = '';

  constructor(
    private profileService: ProfileService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (p) => { this.profile = p; this.cdr.detectChanges(); },
      error: () => {}
    });

    this.contactForm = new FormGroup({
      name:    new FormControl('', [Validators.required, TextValidators.noWhitespace()]),
      email:   new FormControl('', [Validators.required, ContactValidators.validEmail()]),
      message: new FormControl('', [Validators.required, TextValidators.noWhitespace(), TextValidators.minLengthTrimmed(10)])
    });
  }

  get name()    { return this.contactForm.get('name')!; }
  get email()   { return this.contactForm.get('email')!; }
  get message() { return this.contactForm.get('message')!; }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();    //ensures that all form controls are marked as touched which will trigger validation messages to be displayed for any invalid fields.
      return;
    }

    this.isSending = true;
    this.errorMessage = '';

    this.messageService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.isSending = false;
        this.submitted = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSending = false;
        this.errorMessage = 'Failed to send message. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}