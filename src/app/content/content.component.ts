import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppConstants, ErrorConsts, MessageConstants } from '@shared/app.constants';
import { ChromeService } from '@shared/chrome.service';
import { SearchEngineProvider } from '@shared/search-engine.provider';
import { AIOMessageModel } from '@shared/types';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'chatgpt-aio-container',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  public answer: string = "Waiting for response...";

  public isCompleted: boolean = false;
  public isError: boolean;
  public errorCode: string;

  public readonly ErrorConsts = ErrorConsts;
  
  private port: chrome.runtime.Port;

  constructor(
    private chromeService: ChromeService,
    private cdr: ChangeDetectorRef,
    private markdownService: MarkdownService,
    private searchEngineProvider: SearchEngineProvider
  ) {
  }

  ngAfterContentInit(): void {
    // this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.port = chrome.runtime.connect({name: AppConstants.PORT_CHANNEL});
    const prompt = this.getPrompt();
    console.log('prompt', prompt);
    this.handleMessages(prompt);
  }

  private getPrompt(): string | null {
    const searchEngine = this.searchEngineProvider.create(window.location.hostname);
    if (searchEngine)
        return searchEngine.getPrompt();

    return null;

    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const prompt = urlParams.get('q');
    // console.log('prompt', prompt);
    // return prompt;
  }

  private setAnswerModel = (res: AIOMessageModel) => {
    // console.log('set Answer Model', res);
    if (res?.type === MessageConstants.CONVERSATION_ANSWER) {
      this.setAnswer(res?.data?.text);
    } else if (res?.type === MessageConstants.ERROR_RESPONSE) {
      this.setAnswer(res?.data?.message);
      this.isCompleted = true;
    } else if (res?.type === MessageConstants.CONVERSATION_ANSWER_COMPLETED) {
      this.isCompleted = true;
    }

    this.cdr.detectChanges();
    // this.markdownService.reload();
  }

  private setAnswer = (text: string) => {
    this.answer = text;
  }

  private callback = (tokenRes: AIOMessageModel, prompt: string) => {
    console.log("response to content script TOKEN", tokenRes);
      if (tokenRes?.data?.token) {
        const request: AIOMessageModel = { 
          type: MessageConstants.GENERATE_CONVERSATION,
          data: {
              token: tokenRes?.data?.token,
              model: 'text-davinci-002-render',
              prompt: prompt
          }
        };

        this.port.onMessage.addListener((message, port) => {
          this.setAnswerModel(message);
        });
        this.port.postMessage(request);
      } else {
        this.isError = true;
        this.errorCode = tokenRes?.data?.error;
        this.cdr.detectChanges();
        console.error(this.isError, this.errorCode);
      }
  }

  private handleMessages(prompt: string | null) {
    if (!prompt) return;

    this.chromeService.sendMessage({ type: MessageConstants.GET_ACCESS_TOKEN }, (res: AIOMessageModel) => {
      this.callback(res, prompt);
    });
  }
}
