export class AppConstants {
  public static readonly APP_NAME = 'ChatGPT - All in One';
  public static readonly APP_VERSION = '1.0.0';
  public static readonly APP_SLUG = 'chatgpt-aio';
  public static readonly PORT_CHANNEL = 'CHATGPT_AIO_CHANNEL';
}

// Simple one-time requests
export class MessageConstants {
  public static readonly GET_ACCESS_TOKEN = 'GET_ACCESS_TOKEN';
  public static readonly ACCESS_TOKEN_RESPONSE = 'ACCESS_TOKEN_RESPONSE';

  public static readonly GET_CONVERSATIONS = 'GET_CONVERSATIONS';
  public static readonly GET_MODELS = 'GET_MODELS';
  public static readonly GENERATE_CONVERSATION = 'GENERATE_CONVERSATION';
  public static readonly CONVERSATION_ANSWER = 'CONVERSATION_ANSWER';
  public static readonly CONVERSATION_ANSWER_COMPLETED = 'CONVERSATION_ANSWER_COMPLETED';

  public static readonly ERROR_RESPONSE = 'ERROR_RESPONSE';
}

export class ErrorConsts {
  public static readonly 400 = 'BAD_REQUEST';
  public static readonly 401 = 'UNAUTHORIZED';
  public static readonly 403 = 'FORBIDDEN';
}

export class CacheKeys {
    public static readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
}