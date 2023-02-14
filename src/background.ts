import { MessageConstants } from "@shared/app.constants";
import { ChatService } from "@shared/chat.service";
import { AIOMessageModel } from "@shared/types";


console.log('background js loaded');

chrome.runtime.onMessage.addListener(async (message: AIOMessageModel, sender, sendResponse) => {
  if (message.type === MessageConstants.GET_ACCESS_TOKEN) {
    const chatService = new ChatService();

    const res = chatService.getAccessToken().then(res => {
      console.log('res in then', res);
      sendResponse({ farewell: 'goodbye', data: res });
    });

    console.log('res after then', res);
    sendResponse({ farewell: 'goodbye2', data: res });
    

    // .then((res) => {
    //   console.log('callback getAccessToken', res);
      
    // });

    // chatService.getAuthSession().then(res => res.json()).then((res) => {
    //   console.log('fetched data', res);
    //   console.log('callback xxx3', sendResponse);
    //   sendResponse({ farewell: 'goodbye', data: res });
    // }).catch((err) => {
    //   sendResponse({});
    // });
    return true; // Inform Chrome that we will make a delayed sendResponse
  }
  return false;
});