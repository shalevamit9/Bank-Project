interface BaseMessage {
    status: number;
    message: string;
}

export interface ErrorMessage extends BaseMessage {
    stack?: string;
}

export interface ResponseMessage extends BaseMessage {
    data?: {
        [key: string]: any;
    };
}
