import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppConstants, ErrorConsts, MessageConstants, TRIGGER_MODES } from '@shared/app.constants';
import { ChromeService } from '@shared/chrome.service';
import { SearchEngineProvider } from '@shared/search-engine.provider';
import { SettingService } from '@shared/setting.service';
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
    private searchEngineProvider: SearchEngineProvider,
    private settingService: SettingService
  ) {
  }

  ngAfterContentInit(): void {
    // this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const mode = this.settingService.getTriggerMode();
    console.log(mode);
    if (mode == TRIGGER_MODES.AUTO) {
      this.trigger();
    }
  }

  private trigger() {
    this.port = chrome.runtime.connect({name: AppConstants.PORT_CHANNEL});
    const prompt = this.getPrompt();
    this.handleMessages(prompt);
  }

  private getPrompt(): string | null {
    const searchEngine = this.searchEngineProvider.create(window.location.hostname);
    if (searchEngine)
        return searchEngine.getPrompt();

    return null;
  }

  private setAnswerModel = (res: AIOMessageModel) => {
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
