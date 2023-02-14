import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageConstants } from '@shared/app.constants';
import { AppService } from 'src/shared/app.service';
import { ChromeService } from 'src/shared/chrome.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, AfterViewInit {

  constructor(
    private sanitizer: DomSanitizer,
    private appService: AppService,
    private chromeService: ChromeService
    ) { }

  ngAfterViewInit(): void {
    
  }
  
  url: string = "https://chat.openai.com";
  public safeUrl: SafeResourceUrl | undefined;

  ngOnInit(): void {

    console.log('send message to content script: GET_ACCESS_TOKEN');
    

    this.chromeService.sendMessage({ 
      type: MessageConstants.GET_ACCESS_TOKEN
     }, (response) => {
      console.log('response to popup', response);
    });

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}