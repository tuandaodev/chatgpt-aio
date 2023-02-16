import { AppConstants, CacheKeys, MessageConstants } from "@shared/app.constants";
import { ChatService } from "@shared/chat.service";
import { AIOMessageModel } from "@shared/types";

import { Cache } from "memory-cache";

var cache = new Cache<string, string>();
const chatService = new ChatService();

export async function getAccessToken(): Promise<string> {
  
  const cachedToken = cache.get(CacheKeys.ACCESS_TOKEN);
  if (cachedToken) {
    console.log('return cached token', cachedToken);
    return cachedToken;
  }

  const token = await chatService.getAccessToken();
  if (token) {
    cache.put(CacheKeys.ACCESS_TOKEN, token);
  }

  console.log('return new fetch token', token);
  return token;
}

export function getModelName(): string {
  return 'text-davinci-002-render';
}

export async function generateConversation(prompt: string, token: string, model: string, port: chrome.runtime.Port, signal: AbortSignal): Promise<string> {
  chatService.setToken(token);
  const response = await chatService.generateConversation(prompt, model, signal);
  if (response.body == null) return '';

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = await reader.read();
  while (!result.done) {
    const text = decoder.decode(result.value);
    parseAndSendConversationText(text, port);
    result = await reader.read();
  }

  result = await reader.read();
  const lastDecode = decoder.decode(result.value);
  console.log('done reading response', lastDecode);
  return lastDecode;
}

export function parseAndSendConversationText(text: string, port: chrome.runtime.Port) {
  
  let trimText = text.trim();
  if (!trimText) return;

  try {
    if (trimText.startsWith("data: ")) {
      const parts = trimText.split("data: ");
      trimText = parts.at(-1) ?? '';
    }
    
    let answerRes: AIOMessageModel;
    if (trimText == "[DONE]") {
      answerRes = {
        type: MessageConstants.CONVERSATION_ANSWER_COMPLETED,
        data: {}
      }
      
      port.postMessage(answerRes);
      return;
    }

    const json = JSON.parse(trimText);
    if (json?.detail) {
      answerRes = {
        type: MessageConstants.ERROR_RESPONSE,
        data: {
          message: json?.detail,
        }
      }
    } else {
      answerRes = {
        type: MessageConstants.CONVERSATION_ANSWER,
        data: {
          conversation_id: json?.conversation_id,
          message_id: json?.message?.id,
          text: json.message?.content?.parts?.[0],
        }
      }
    }
    port.postMessage(answerRes);
  } catch (e) {
    console.error('error parsing json', `xxx${trimText}xxx`, e);
  }
}

console.log('background js loaded');
chrome.runtime.onConnect.addListener(function(port: chrome.runtime.Port) {
  // Create an instance of AbortController
  const controller = new AbortController();
  const signal = controller.signal;

  if (port.name === AppConstants.PORT_CHANNEL) {
    port.onMessage.addListener(function(msg: AIOMessageModel) {
      console.log('background receivea message', msg);

      if (msg.type === MessageConstants.GENERATE_CONVERSATION) {
        console.log('received message data', msg.data);
        generateConversation(msg.data.prompt, msg.data.token, msg.data.model, port, signal).then(res => {
          parseAndSendConversationText(res, port);
        });
      }
    });
    port.onDisconnect.addListener(() => {
      console.log('port disconnected');
      controller.abort();
    });
  }
});

chrome.runtime.onMessage.addListener((message: AIOMessageModel, sender, sendResponse) => {
  if (message.type === MessageConstants.GET_ACCESS_TOKEN) {
    getAccessToken().then(res => {
      sendResponse({
        type: MessageConstants.ACCESS_TOKEN_RESPONSE,
        data: {
          token: res
        }
      });
    }).catch((err: Error) => {
      sendResponse({ 
        type: MessageConstants.ERROR_RESPONSE,
        data: {
          error: err.message,
        }
      });
      console.log('error getting access token', err);
    });
    
    return true; // Inform Chrome that we will make a delayed sendResponse
  }

  // if (message.type === MessageConstants.GENERATE_CONVERSATION) {
  //   console.log('received message data', message.data);
  //   generateConversation(message.data.prompt, message.data.token, message.data.model, sendResponse).then(res => {
  //     console.log('generate conversation res', res);
  //     parseAndSendConversationText(res, sendResponse);
  //   });
  //   return true; // Inform Chrome that we will make a delayed sendResponse
  // }

  // if (message.type === MessageConstants.GET_CONVERSATIONS) {
  //   chatService.getConversations().then(res => res.json()).then(res => {
  //     console.log('getConversations res', res);
  //     sendResponse({ data: res });
  //   });
  //   return true; // Inform Chrome that we will make a delayed sendResponse
  // }

  // if (message.type === MessageConstants.GET_MODELS) {
  //   chatService.getModels().then(res => res.json()).then(res => {
  //     console.log('getModels res', res);
  //     sendResponse({ data: res });
  //   });
  //   return true; // Inform Chrome that we will make a delayed sendResponse
  // }
  
  return false;
});

