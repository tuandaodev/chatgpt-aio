import { v4 as uuidv4 } from 'uuid';
import { ErrorConsts } from './app.constants';

export class ChatService {

    private _apiUrl: string = "https://chat.openai.com";
    private _token: string;

    public constructor() { }

    public setToken(token: string) {
        this._token = token;
    }

    // private getHeaders() {
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${this._token}`,
    //     };
    //     console.log('headers', headers);
    //     return headers;
    // }

    public getAuthSession() {
        const url = `${this._apiUrl}/api/auth/session`;
        return fetch(url);
    }

    public generateConversation(prompt: string, model: string, signal: AbortSignal) {
        const url = `${this._apiUrl}/backend-api/conversation`;
        return fetch(url, {
            method: "POST",
            signal: signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._token}`,
            },
            body: JSON.stringify({
                action: 'next',
                messages: [
                  {
                    id: uuidv4(),
                    role: 'user',
                    content: {
                      content_type: 'text',
                      parts: [prompt],
                    },
                  },
                ],
                model: model,
                parent_message_id: uuidv4(),
              }),
        });
    }

    public getConversations() {
        return fetch(`${this._apiUrl}/backend-api/conversations?offset=0&limit=20`, {
            method: "GET",
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._token}`,
            }
        });
    }

    public getModels() {
        const url = `${this._apiUrl}/backend-api/models`;
        return fetch(url, {
            method: "GET",
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._token}`,
            }
        });
    }

    public async getAccessToken(): Promise<string> {
        const res = await this.getAuthSession();
        if (res.status === 403) {
            throw new Error(ErrorConsts[403]);
        }

        const json = await res.json();
        if (!json?.accessToken) {
            throw new Error(ErrorConsts[401]);
        }

        return json.accessToken;
    }
}
