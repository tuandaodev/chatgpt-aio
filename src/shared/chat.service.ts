import { AuthSessionModel } from "./types";

// var cache = require('memory-cache');

export class ChatService {

    private _apiUrl: string = "https://chat.openai.com";

    public constructor() { }

    public getAuthSession() {
        const url = `${this._apiUrl}/api/auth/session`;
        return fetch(url);
    }

    public async getAccessToken(): Promise<string> {


        console.log('getAccessToken');

        // const cache = new LocalStoreManager();
        // const cachedToken = cache.getData(CacheKeys.ACCESS_TOKEN);
        // if (cachedToken)
        //     return cachedToken;

        const res = await this.getAuthSession();

        console.log('fetch res', res);

        const json = await res.json();

        console.log('json res', json);

        // TODO: handle error
        // if (!json?.accessToken)
        //     return null;

        // cache.saveSessionData(CacheKeys.ACCESS_TOKEN, json.accessToken);
        return json.accessToken;
    }
}
