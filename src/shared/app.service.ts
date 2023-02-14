import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  private _chatService: ChatService;

  constructor(
    private _http: HttpClient,
  ) {
  }

  // public get chatService() {
  //   if (!this._chatService) {
  //     this._chatService = new ChatService(this._http);
  //   }
  //   return this._chatService;
  // }
}
