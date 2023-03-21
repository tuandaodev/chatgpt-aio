import { Injectable } from '@angular/core';
import { CacheKeys, TRIGGER_MODES } from './app.constants';

@Injectable({
  providedIn: 'root',
})
export class SettingService {

  constructor(
  ) {
  }

  public getTriggerMode(): string {
    const json = localStorage.getItem(CacheKeys.SETTINGS);
    if (!json) return TRIGGER_MODES.AUTO;

    try {
      const data = JSON.parse(json);
      if (data) {
        return data.triggerMode;
      }
    } catch {}

    return TRIGGER_MODES.AUTO;
  }

  public getContains(): string[] {
    const json = localStorage.getItem(CacheKeys.SETTINGS);
    if (!json) return ["?"];

    try {
      const data = JSON.parse(json);
      if (data) {
        return data.triggerContainers.split(",").map((x: string) => x.trim());
      }
    } catch {}
    
    return ["?"];
  }
}
