import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ChatMessage } from './chat-message.model';

@Injectable({ providedIn: 'root' })
export class ChatMessageService {
  private resourceUrl = ApiService.API_URL + '/chat-messages';

  constructor(protected http: HttpClient) {}

  create(chatMessage: ChatMessage): Observable<HttpResponse<ChatMessage>> {
    return this.http.post<ChatMessage>(this.resourceUrl, chatMessage, { observe: 'response' });
  }

  update(chatMessage: ChatMessage): Observable<HttpResponse<ChatMessage>> {
    return this.http.put(`${this.resourceUrl}/${chatMessage.id}`, chatMessage, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ChatMessage>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ChatMessage[]>> {
    const options = createRequestOption(req);
    return this.http.get<ChatMessage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  sendMessage(messageData: { serviceId: number; content: string }): Observable<HttpResponse<ChatMessage>> {
    return this.http.post<ChatMessage>(`${this.resourceUrl}/send`, messageData, { observe: 'response' });
  }
}
