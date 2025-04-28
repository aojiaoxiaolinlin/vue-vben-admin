import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type ExtendOptions<T = unknown> = {
  /**
   * 参数序列化方式。预置的有
   * - brackets: ids[]=1&ids[]=2&ids[]=3
   * - comma: ids=1,2,3
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3
   * - repeat: ids=1&ids=2&ids=3
   */
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];

  // TODO: 我觉得这个功能很傻逼，考虑去除
  /**
   * 响应数据的返回方式。
   * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
   * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
   * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
type RequestClientConfig<T = unknown> = AxiosRequestConfig<T> &
  ExtendOptions<T>;

type RequestResponse<T = unknown> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

interface HttpResponse<T = unknown> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}

type HttpResponseData<T> = T extends HttpResponse<infer U> ? U : never;

interface HttpErrorResponse {
  code: number;
  message: string;
  error: string;
}

type MakeErrorMessageFn = (
  message: string,
  error: AxiosError<HttpErrorResponse>,
) => void;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig<unknown>)
    | (ExtendOptions & Promise<InternalAxiosRequestConfig<unknown>>);
  rejected?: (error: unknown) => unknown;
}

interface ResponseInterceptorConfig<T = HttpResponse> {
  fulfilled?: (response: RequestResponse<T>) => HttpResponseData<T> | T;
  rejected?: (
    error: AxiosError<HttpErrorResponse>,
  ) => AxiosError | Promise<AxiosError>;
}

export type {
  HttpResponse,
  HttpResponseData,
  MakeErrorMessageFn,
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
};
