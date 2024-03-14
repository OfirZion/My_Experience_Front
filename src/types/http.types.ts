export interface IResponse<T> {
    message: string;
    data: T | null;
    status: number;
}

export interface IToken {
    accessToken: string;
    refreshToken: string;
}