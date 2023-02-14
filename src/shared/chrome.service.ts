import { Injectable } from '@angular/core';
import { AIOMessageModel } from './types';

declare const chrome: any;

@Injectable({
  providedIn: 'root'
})
export class ChromeService {

  sendMessage(message: AIOMessageModel, callback?: (response: any) => void) {
    chrome.runtime.sendMessage(message, callback);
  }

}