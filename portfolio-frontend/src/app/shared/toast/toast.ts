import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent implements OnDestroy {
  toasts: Toast[] = [];
  private sub: Subscription;

  constructor(private toastService: ToastService) {   //dep inj
    this.sub = this.toastService.toasts$.subscribe(t => {
      this.toasts = t;
    });
  }

  dismiss(id: number): void {      // X   example : dismiss(3) --> service removes toast 3 ->obs emits->component receives->toast removed
    this.toastService.dismiss(id);
  }

  ngOnDestroy(): void {  //to stop listening to prevent memory leaks when component is destroyed
    this.sub.unsubscribe();
  }

  icon(type: string): string {  //returns a css icon class based on the toast type (comes from service)
    if (type === 'success') {
      return 'fas fa-check-circle';
    } 
    else if (type === 'error') {
      return 'fas fa-exclamation-circle';
    } 
    else {
      return 'fas fa-info-circle';
    }
  }
}