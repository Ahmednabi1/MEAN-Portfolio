import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {  //didn't need to create a seperate file for this interface since it's only used in the service and component
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // private counter = 0; 
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();  //since it will be read only no need to expose the toast just the observable

  // show(message: string, type: Toast['type'] = 'info', duration = 3500): void {
  show(message: string, type: Toast['type'], duration = 3500): void {
    // const id = ++this.counter;
    const id = Date.now() + Math.random();   //math.rand to prevent duplicate ids if two toasts are created in the same millisecond same as in images
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void { 
    this.show(message, 'success'); 
  }
  error(message: string): void { 
    this.show(message, 'error'); 
  }
  info(message: string): void {
     this.show(message, 'info'); 
    }

  dismiss(id: number): void {
    this.toastsSubject.next(
      this.toastsSubject.getValue().filter(t => t.id !== id)
    );
  }
}