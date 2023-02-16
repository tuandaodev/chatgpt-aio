import { AppConstants, MessageConstants } from "@shared/app.constants";
import { ChromeService } from "@shared/chrome.service";
import { AIOMessageModel } from "@shared/types";


// const container = document.createElement('div');
// container.id = 'my-app-container';
// document.body.appendChild(container);

// scriptLoader(chrome.runtime.getURL('main.js'));
// scriptLoader(chrome.runtime.getURL('runtime.js'));
// scriptLoader(chrome.runtime.getURL('polyfills.js'));


// var s = document.createElement('script');
// s.src = chrome.runtime.getURL('chatgpt-aio.js');
// s.onload = function() {
//     // this.remove();
// };
// (document.head || document.documentElement).appendChild(s);

const chatGptContainer = document.querySelector('#center_col');
console.log('parent', chatGptContainer);
if (chatGptContainer) {
  let newElement = document.createElement('chatgpt-aio-app-root');
  // newElement.id = 'angular-chrome-app';
  chatGptContainer.parentNode?.insertBefore(newElement, chatGptContainer.nextSibling);
}

// const ROOT_ELEMENT_TAG = 'my-toggle-test';
// let rootElement = document.querySelector(ROOT_ELEMENT_TAG);
// if (!rootElement) {
//   rootElement = document.createElement(ROOT_ELEMENT_TAG);
//   rootElement.id = 'angular-chrome-app';
//   document.body.appendChild(document.createElement(ROOT_ELEMENT_TAG));
// }


console.log("content script loaded 2");

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const prompt = urlParams.get('q');
// console.log('prompt', prompt);


// Init services
// const chromeService = new ChromeService();
// var port = chrome.runtime.connect({name: AppConstants.PORT_CHANNEL});

// chrome.runtime.onConnect.addListener(function(port) {
//   if (port.name == "myport") {
//     port.onMessage.addListener(function(msg) {
//       console.log(msg.greeting);
//     });
//   }
// });

// chromeService.sendMessage({ type: MessageConstants.GET_ACCESS_TOKEN }, (tokenRes) => {
//   console.log("response to content script TOKEN", tokenRes);
//   if (tokenRes?.token) {


//     const request: AIOMessageModel = { 
//       type: MessageConstants.GENERATE_CONVERSATION,
//       data: {
//           token: tokenRes.token,
//           model: 'text-davinci-002-render',
//           prompt: prompt + " in 50 words"
//       }
//     };
//     port.postMessage(request);

//     port.onMessage.addListener(function(msg) {
//       console.log('contentscript receive message', msg);
//       if (msg.question === "Who's there?")
//         port.postMessage({answer: "Madame"});
//       else if (msg.question === "Madame who?")
//         port.postMessage({answer: "Madame... Bovary"});
//     });

//     //TODO: remove limit
//     return;
//     chromeService.sendMessage({ 
//         type: MessageConstants.GENERATE_CONVERSATION,
//         data: {
//             token: tokenRes.token,
//             model: 'text-davinci-002-render',
//             prompt: prompt + " in 50 words"
//         }
//     }, (modelRes) => {
//         console.log("response to content script generate answers", modelRes);
//     });

//     // chromeService.sendMessage({ type: MessageConstants.GET_CONVERSATIONS }, (conversationsRes) => {
//     //   console.log("response to content script CONVERSATIONS", conversationsRes);
//     // });
//   }
// });



function scriptLoader(path: string, callback?: () => void)
{
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.async = true;
    script.src = path;
    script.onload = function(){
        if (typeof(callback) == "function")
        {
            callback();
        }
    }
    try
    {
        var scriptOne = document.getElementsByTagName('script')[0];
        scriptOne.parentNode?.insertBefore(script, scriptOne);
    }
    catch(e)
    {
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}