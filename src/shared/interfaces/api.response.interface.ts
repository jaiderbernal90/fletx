export interface IResponse<T> {
  message: string;
  data: T;
}
export interface IResponseToken {
  token: string;
}

export interface ApiResponse<T> extends Response<T> {
  success: boolean;
  timestamp: string;
  statusCode: number;
  traceId: string;
  path?: string;
}

export interface ApiErrorResponse<T> extends ApiResponse<T> {
  error?: string;
  details?: any;
}

export interface Response<T> {
  message?: string | null;
  data?: T | null;
  meta?: IPageMeta | null;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta: IPageMeta;
}

export interface IPageMeta {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly order: string;
  links?: {
    self: string;
    next: string;
    previous: string;
    first: string;
    last: string;
  };
}

export interface IPageMetaDtoParameters {
  pageOptionsDto: IPageMeta;
  itemCount: number;
}
