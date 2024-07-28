
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HTTPMethod;
  headers: HeadersInit;
  body?: string;
}

class FlowCraftAPIMethod {
  private baseURL: string = "http://localhost:5148/api/";

  private async request<T>(method: HTTPMethod, endpoint: string, data: any = null, headers: HeadersInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const options: RequestOptions = {
      method,
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
      const jwtToken = response.headers.get("JWT");
      if(jwtToken)localStorage.setItem("Autorization", jwtToken);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Something went wrong');
      }

      if (response.status !== 204) {
        return await response.json();
      }

      return null as unknown as T; // If the response is 204 No Content
    } catch (error) {
      console.error(`HTTP ${method} request to ${url} failed:`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>('GET', endpoint, null, headers);
  }

  public post<T>(endpoint: string, data: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  public put<T>(endpoint: string, data: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  public delete<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, null, headers);
  }
}

const FlowCraftAPI = new FlowCraftAPIMethod()

export default FlowCraftAPI;