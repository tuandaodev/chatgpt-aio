export interface AIOMessageModel {
    type: string;
    data?: any;
}

export interface AuthSessionModel {
    user:        UserModel;
    expires:     Date;
    accessToken: string;
}

export interface UserModel {
    id:      string;
    name:    string;
    email:   string;
    image:   string;
    picture: string;
    groups:  any[];
}

export interface AccessTokenModel {
    statusCode: number;
    token?: string;
    isSuccess: boolean;
}