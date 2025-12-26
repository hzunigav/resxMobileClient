import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subject } from 'rxjs';
import { takeUntil, switchMap, retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChatMessageService } from '#app/pages/entities/chat-message/chat-message.service';
import { ChatMessage } from '#app/pages/entities/chat-message/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatPollingService implements OnDestroy {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  private messageCache = new Set<number>();
  private lastMessageId = 0;
  private currentServiceId: number | null = null;
  private pollingInterval = 5000; // 5 seconds
  private maxRetries = 3;

  private stopPolling$ = new Subject<void>();
  private isPolling = false;

  constructor(private chatMessageService: ChatMessageService) {}

  /**
   * Start polling for new messages for a specific service
   * @param serviceId The service ID to poll messages for
   */
  startPolling(serviceId: number): void {
    if (this.isPolling && this.currentServiceId === serviceId) {
      return; // Already polling for this service
    }

    // Stop any existing polling
    this.stopPolling();

    // Reset state
    this.currentServiceId = serviceId;
    this.messageCache.clear();
    this.lastMessageId = 0;
    this.messagesSubject.next([]);
    this.isPolling = true;

    // Load initial messages
    this.loadInitialMessages(serviceId);

    // Start polling
    interval(this.pollingInterval)
      .pipe(
        takeUntil(this.stopPolling$),
        switchMap(() => this.pollNewMessages(serviceId)),
        retry(this.maxRetries),
        catchError(error => {
          console.error('Polling error:', error);
          return of([]); // Return empty array on error
        }),
      )
      .subscribe(newMessages => {
        if (newMessages.length > 0) {
          this.addMessages(newMessages);
        }
      });
  }

  /**
   * Stop polling for messages
   */
  stopPolling(): void {
    if (this.isPolling) {
      this.stopPolling$.next();
      this.isPolling = false;
      this.currentServiceId = null;
    }
  }

  /**
   * Load initial messages for a service
   * @param serviceId The service ID
   */
  private loadInitialMessages(serviceId: number): void {
    this.chatMessageService.query({ 'serviceId.equals': serviceId, sort: ['sentAt,asc'] }).subscribe(
      response => {
        const messages = response.body || [];
        this.messagesSubject.next(messages);

        // Update cache and lastMessageId
        messages.forEach(msg => {
          if (msg.id) {
            this.messageCache.add(msg.id);
            if (msg.id > this.lastMessageId) {
              this.lastMessageId = msg.id;
            }
          }
        });
      },
      error => {
        console.error('Error loading initial messages:', error);
      },
    );
  }

  /**
   * Poll for new messages since last message ID
   * @param serviceId The service ID
   * @returns Observable of new messages
   */
  private pollNewMessages(serviceId: number): Observable<ChatMessage[]> {
    return this.chatMessageService.query({
      'serviceId.equals': serviceId,
      sort: ['sentAt,asc'],
      'id.greaterThan': this.lastMessageId,
    }).pipe(
      switchMap(response => {
        const newMessages = (response.body || []).filter(msg => msg.id && !this.messageCache.has(msg.id));
        return of(newMessages);
      }),
    );
  }

  /**
   * Add new messages to the list and update cache
   * @param messages New messages to add
   */
  private addMessages(messages: ChatMessage[]): void {
    const currentMessages = this.messagesSubject.value;
    const deduplicatedMessages = messages.filter(msg => {
      if (msg.id && !this.messageCache.has(msg.id)) {
        this.messageCache.add(msg.id);
        if (msg.id > this.lastMessageId) {
          this.lastMessageId = msg.id;
        }
        return true;
      }
      return false;
    });

    if (deduplicatedMessages.length > 0) {
      const updatedMessages = [...currentMessages, ...deduplicatedMessages].sort((a, b) => {
        const timeA = new Date(a.sentAt || 0).getTime();
        const timeB = new Date(b.sentAt || 0).getTime();
        return timeA - timeB;
      });
      this.messagesSubject.next(updatedMessages);
    }
  }

  /**
   * Send a new message (optimistic update)
   * @param message The message to send
   */
  sendMessage(message: ChatMessage): void {
    if (!this.currentServiceId) {
      return;
    }

    // Optimistically add to UI
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);

    // Prepare data for backend (just serviceId and content)
    const messageData = {
      serviceId: message.service?.id!,
      content: message.messageText!,
    };

    // Send to backend
    this.chatMessageService.sendMessage(messageData).subscribe(
      response => {
        // Update with server response
        const createdMessage = response.body;
        if (createdMessage?.id) {
          this.messageCache.add(createdMessage.id);
          if (createdMessage.id > this.lastMessageId) {
            this.lastMessageId = createdMessage.id;
          }

          // Replace optimistic message with server message
          const messages = this.messagesSubject.value;
          const index = messages.findIndex(m => m === message);
          if (index !== -1) {
            messages[index] = createdMessage;
            this.messagesSubject.next([...messages]);
          }
        }
      },
      error => {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        const messages = this.messagesSubject.value.filter(m => m !== message);
        this.messagesSubject.next(messages);
      },
    );
  }

  /**
   * Get current messages
   * @returns Current messages array
   */
  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.messagesSubject.next([]);
    this.messageCache.clear();
    this.lastMessageId = 0;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
