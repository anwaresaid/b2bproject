import type { App } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";
import type { AxiosResponse } from "axios";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }
  public static consts() {
    const data = { filter: 1, filterSearch: 2, pagination: 3 };
    return data;
  }
  public static constsPost() {
    const data = { fileUpload: 0 };
    return data;
  }
  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }
  public static getTest(
    resource: string,
    slug = "" as string,
    dataType: Number,
    sign: string
  ): Promise<AxiosResponse> {
    let temp;

    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;

    if (dataType === this.consts().filter) {
      temp = "?" + new URLSearchParams(slug).toString();
      return ApiService.vueInstance.axios.get(`${resource}${temp}`);
    } else if (dataType === this.consts().filterSearch) {
      temp = "?search=" + slug;
      return ApiService.vueInstance.axios.get(`${resource}${temp}`);
    } else if (dataType === this.consts().pagination) {
      let operator;
      if (sign) {
        operator = "?";
      } else if (slug && !dataType) {
        operator = "&";
      }
      temp = operator + new URLSearchParams(slug).toString();
      return ApiService.vueInstance.axios.get(`${resource}${temp}`);
    } else {
      return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
    }
  }
  public static postTest(
    resource: string,
    params: any,
    type: number,
    config: object
  ): Promise<AxiosResponse> {
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    if (resource === "users/two-factory") {
      return ApiService.vueInstance.axios
        .post(`${resource}`, params)
        .then((response) => {
          ApiService.vueInstance.axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.data.token}`;
          localStorage.setItem(
            "token",
            JSON.stringify(response.data.data.token)
          );
          return response;
        });
    }
    if (type && type === this.constsPost().fileUpload) {
      return ApiService.vueInstance.axios.post(`${resource}`, params, config);
    }
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }
  public static postZip(
    resource: string,
    params: any,
    type: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params, type);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
