import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const getSuccessResult = (data: any) => {
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.msg);
  }
};

class HttpRequest {
  baseUrl: string;
  queue: any;
  queueCancel: any;
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.queue = {};
    this.queueCancel = {};
    this.axios = axios.create();
    this.setupAxios();
  }

  getInsideConfig(): AxiosRequestConfig {
    // const $store = store as any;
    const config = {
      headers: {
        Authorization:
          /*       $store.state.wallet.token ||  */ "c94a7a9a-fbb9-4d26-9253-a10e23462360",
        // visitorToken: $store.state.user.visitorToken || "",
      },
    };
    return config;

    // return {};
  }

  //   TODO 配置 HTTP 请求~
  setupAxios(): void {
    this.axios.interceptors.request.use(
      (config: any) => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[config.url] = true;
        return config;
      },
      (error: Error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      (res: any) => {
        this.destroy(res.config.url);
        const { data } = res;
        if (typeof data === "object") {
          return getSuccessResult(data);
        }
        return data;
      },
      (error: any) => {
        if (error.response) {
          let errorInfo = error.response;

          if (error.response.status != 401) {
            if (!errorInfo) {
              const {
                request: { statusText, status },
                config,
              } = JSON.parse(JSON.stringify(error));
              errorInfo = {
                statusText,
                status,
                request: { responseURL: config.url },
              };
            }
          } else {
            //   store.dispatch("logOut", true);
            //   checkWalletFlow();
            return;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  destroy(url: string): void {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  request(options: AxiosRequestConfig, cancel = false): any {
    if (!options.url) {
      throw new Error("Invalid url.");
    }

    let cancelToken;
    if (cancel) {
      if (this.queueCancel[options.url]) {
        this.queueCancel[options.url].cancel("The request canceled.");
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      this.queueCancel[options.url] = source;
      cancelToken = source.token;
    }

    options = {
      baseURL: this.baseUrl,
      ...options,
      cancelToken,
      ...this.getInsideConfig(),
      headers: { ...this.getInsideConfig().headers, ...options.headers },
    };

    return this.axios(options).catch((error) => {
      this.destroy(options.url || "");
      return Promise.reject(error);
    });
  }

  get(url: string, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: "get" }, cancel);
  }

  post(url: string, data: any = {}, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: "post", data }, cancel);
  }

  delete(url: string, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: "delete" }, cancel);
  }

  put(url: string, data: any = {}, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: "put", data }, cancel);
  }
}

export default HttpRequest;

export const passHttp = new HttpRequest(import.meta.env.VITE_API_URL);
