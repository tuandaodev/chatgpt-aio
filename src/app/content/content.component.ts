import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppConstants, MessageConstants } from '@shared/app.constants';
import { ChromeService } from '@shared/chrome.service';
import { AIOMessageModel } from '@shared/types';

@Component({
  selector: 'chatgpt-aio-container',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  public answer: string = "Waiting for response...";
  public isCompleted: boolean = false;
  
  private port: chrome.runtime.Port;

  constructor(
    private chromeService: ChromeService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterContentInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.port = chrome.runtime.connect({name: AppConstants.PORT_CHANNEL});
    const prompt = this.getPrompt();
    this.handleMessages(prompt);
  }

  private getPrompt() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const prompt = urlParams.get('q');
    console.log('prompt', prompt);
    return prompt;
  }

  private setAnswerModel = (res: AIOMessageModel) => {
    console.log('set Answer Model', res);
    if (res?.type === MessageConstants.CONVERSATION_ANSWER) {
      this.setAnswer(res?.data?.text);
    } else if (res?.type === MessageConstants.ERROR_RESPONSE) {
      this.setAnswer(res?.data?.message);
    } else if (res?.type === MessageConstants.CONVERSATION_ANSWER_COMPLETED) {
      this.isCompleted = true;
    }

    this.cdr.detectChanges();
  }

  private setAnswer = (text: string) => {
    this.answer = text;
  }

  private callback = (tokenRes: any, prompt: string) => {
    console.log("response to content script TOKEN", tokenRes);
      if (tokenRes?.token) {
        const request: AIOMessageModel = { 
          type: MessageConstants.GENERATE_CONVERSATION,
          data: {
              token: tokenRes.token,
              model: 'text-davinci-002-render',
              prompt: prompt
          }
        };

        this.port.onMessage.addListener((message, port) => {
          this.setAnswerModel(message);
        });
        this.port.postMessage(request);
      }
  }

  private handleMessages(prompt: string | null) {
    if (!prompt) return;

    this.chromeService.sendMessage({ type: MessageConstants.GET_ACCESS_TOKEN }, (res) => {
      this.callback(res, prompt);
    });
  }
}
