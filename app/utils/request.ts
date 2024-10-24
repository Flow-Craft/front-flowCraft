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
    saveJWT: boolean = true,
  ): Promise<any> {
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
      let returnJWT;
      if (saveJWT) {
        this.getJWT(response);
      } else {
        returnJWT = response.headers.get('JWT');
      }

      if (!response.ok) {
        if (response.status === 401) {
          const error = new Error('Unauthorized');
          localStorage.clear();
          window.location.href = '/';
          (error as any).status = 401;
          throw error;
        }

        const errorData = await response.json();
        throw new Error(errorData.errors || 'Something went wrong');
      }

      if (response.status !== 204) {
        try {
          if (returnJWT) {
            const rst = await response.json();
            return { JWT: returnJWT, ...rst };
          }
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/pdf')) {
            const pdfBlob = await response.blob();
            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            return pdfUrl;
          }
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
    customeHeader: any = {},
  ): Promise<T> | void {
    let auth;
    if (requireAuth) {
      const token = window.localStorage.getItem(AUTORIZATION_KEY);
      auth = {
        Authorization: `Bearer ${token}`,
      };
    }
    return this.request<T>('GET', endpoint, null, {
      ...auth,
      ...customeHeader,
    });
  }

  public post<T>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true,
    saveJWT: boolean = true,
    Jwt: string = '',
  ): Promise<T> | void {
    let auth;
    if (requireAuth && !Jwt) {
      const token = window.localStorage.getItem(AUTORIZATION_KEY);
      auth = {
        Authorization: `Bearer ${token}`,
      };
    }
    if (Jwt) {
      console.log('entre', Jwt);
      auth = {
        Authorization: `Bearer ${Jwt}`,
      };
    }
    return this.request<T>('POST', endpoint, data, { ...auth }, saveJWT);
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
