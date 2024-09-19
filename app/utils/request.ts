import { AUTORIZATION_KEY } from './const';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HTTPMethod;
  headers: HeadersInit;
  body?: string;
  credentials?: string;
}

class FlowCraftAPIMethod {
  // public baseURL: string = 'http://192.168.1.20:5148/api/';
  public baseURL: string = 'http://localhost:5148/api/';

  private getJWT(response: Response) {
    const jwtToken = response.headers.get('JWT');
    if (jwtToken) localStorage.setItem(AUTORIZATION_KEY, jwtToken);

    //get first name and set in local host
  }

  private async request<T>(
    method: HTTPMethod,
    endpoint: string,
    data: any = null,
    headers: HeadersInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const options: any = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      // localhost manage
      this.getJWT(response);

      if (!response.ok) {
        if (response.status === 401) {
          const error = new Error('Unauthorized');
          (error as any).status = 401;
          throw error;
        }

        const errorData = await response.json();
        throw new Error(errorData.errors || 'Something went wrong');
      }

      if (response.status !== 204) {
        try {
          return await response.json();
        } catch (e) {
          return null as unknown as T;
        }
      }

      return null as unknown as T; // If the response is 204 No Content
    } catch (error) {
      console.error(`HTTP ${method} request to ${url} failed:`, error);
      throw error;
    }
  }

  public get<T>(
    endpoint: string,
    requireAuth: boolean = true,
  ): Promise<T> | void {
    let auth;
    if (requireAuth) {
      const token = window.localStorage.getItem(AUTORIZATION_KEY);
      auth = {
        Authorization: `Bearer ${token}`,
      };
    }
    return this.request<T>('GET', endpoint, null, { ...auth });
  }

  public post<T>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true,
  ): Promise<T> | void {
    let auth;
    if (requireAuth) {
      const token = window.localStorage.getItem(AUTORIZATION_KEY);
      auth = {
        Authorization: `Bearer ${token}`,
      };
    }
    return this.request<T>('POST', endpoint, data, { ...auth });
  }

  public put<T>(
    endpoint: string,
    data: any,
    requireAuth: boolean = true,
  ): Promise<T> | void {
    let auth;
    if (requireAuth) {
      const token = window.localStorage.getItem(AUTORIZATION_KEY);
      auth = {
        Authorization: `Bearer ${token}`,
      };
    }
    return this.request<T>('PUT', endpoint, data, { ...auth });
  }

  public delete<T>(
    endpoint: string,
    requireAuth: boolean = true,
  ): Promise<T> | void {
    let auth;
    if (requireAuth) {
      const token = window.localStorage.getItem(AUTORIZATION_KEY);
      auth = {
        Authorization: `Bearer ${token}`,
      };
    }
    return this.request<T>('DELETE', endpoint, null, { ...auth });
  }
}

const FlowCraftAPI = new FlowCraftAPIMethod();

export default FlowCraftAPI;
