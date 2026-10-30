import { HttpClient, HttpError } from "./HttpClient"

const JSON_HEADERS = { "Content-Type": "application/json" };

export class FetchHttpClient extends HttpClient {
  private readonly baseUrl: string;
  constructor(baseUrl: string = "") {
    super()
    this.baseUrl = baseUrl;
  }

  get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { method: "GET", ...options });
  }

  post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body), ...options });
  }

  put<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { method: "PUT", headers: JSON_HEADERS, body: JSON.stringify(body), ...options });
  }

  delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { method: "DELETE", ...options });
  }

  private async request<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(this.baseUrl + url, init);
    if (!response.ok) {
      throw new HttpError(response.status);
    }
    // Respostas sem corpo (ex.: 204 do DELETE) não podem passar por `json()`.
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }
}
