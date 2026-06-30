import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../core/services/message.service';
import { Message } from '../../core/models/message.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-messages',
  imports: [CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  messages: Message[] = [];
  isLoading = true;
  errorMessage = '';
  selected: Message | null = null;

  constructor(private messageService: MessageService, private toast: ToastService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { 
    this.loadMessages(); 
  }

  loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load messages.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  open(msg: Message): void {
    this.selected = msg;
    if (!msg.isRead && msg._id) {
      this.messageService.markAsRead(msg._id).subscribe({
        next: () => {
          msg.isRead = true;
          this.cdr.detectChanges();
        }
      });
    }
  }

  close(): void { 
    this.selected = null; 
  }

  delete(id: string): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.toast.success('Message deleted.');
        if (this.selected?._id === id) {
          this.selected = null;
        }
        this.loadMessages();
      },
      error: () => this.toast.error('Failed to delete message.')
    });
  }

  unreadCount(): number {
    return this.messages.filter(m => !m.isRead).length;
  }

  formatDate(dateStr: string): string {         //html
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}