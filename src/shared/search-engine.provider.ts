import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchEngineProvider {

  constructor() {}

  create(hostname: string): ISearchEngine | null {
    hostname = hostname.toLowerCase();
    if (hostname.includes('google')) {
      return new GoogleSearchEngine('google');
    } else if (hostname.includes('bing')) {
      return new BingSearchEngine('bing');
    } else if (hostname.includes('yahoo')) {
      return new YahooSearchEngine('yahoo');
    } else if (hostname.includes('kagi')) {
      return new KagiSearchEngine('kagi');
    } else if (hostname.includes('naver')) {
      return new NaverSearchEngine('naver');
    } else if (hostname.includes('brave')) {
      return new BraveSearchEngine('brave');
    } else if (hostname.includes('duckduckgo')) {
      return new DuckduckgoSearchEngine('duckduckgo');
    } else if (hostname.includes('baidu')) {
      return new BaiduSearchEngine('baidu');
    } else if (hostname.includes('yandex')) {
      return new YandexSearchEngine('yandex');
    }

    throw new Error(`Search engine ${hostname} not supported`);
  }
}

export interface ISearchEngine {
  searchEngine: string;
  addWidget(): void;
  getPrompt(): string | null;
}

export class DefaultSearchEngine implements ISearchEngine {

  public searchEngine: string;
  protected newElement: HTMLElement = document.createElement('chatgpt-aio-app-root');

  constructor(_searchEngine: string) {
    this.searchEngine = _searchEngine;
    this.newElement.classList.add(this.searchEngine);
  }

  public addWidget() {
    const container = document.querySelector('#center_col');
    container?.parentNode?.insertBefore(this.newElement, container.nextSibling);
  }

  public getPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q');
  }
}

export class GoogleSearchEngine extends DefaultSearchEngine {}

export class BingSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#b_context');
    container?.insertBefore(this.newElement, container.firstChild);
  }
}

export class YahooSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#right');
    container?.appendChild(this.newElement);
  }
  public override getPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('p');
  }
}

export class KagiSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#wikipediaResults');
    container?.appendChild(this.newElement);
  }
}

export class NaverSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#sub_pack');
    container?.insertBefore(this.newElement, container.firstChild);
  }
  public override getPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('query');
  }
}

export class BraveSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#side-right');
    container?.insertBefore(this.newElement, container.firstChild);
  }
}

export class DuckduckgoSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('.sidebar-modules');
    container?.insertBefore(this.newElement, container.firstChild);
  }
}

export class BaiduSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#content_right');
    container?.insertBefore(this.newElement, container.firstChild);
  }
  public override getPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('wd');
  }
}

export class YandexSearchEngine extends DefaultSearchEngine {
  public override addWidget() {
    const container = document.querySelector('#search-result-aside');
    container?.insertBefore(this.newElement, container.firstChild);
  }
  public override getPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('text');
  }
}