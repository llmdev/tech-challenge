export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`Erro ${status}`);
    this.name = "HttpError";
  }
}

export abstract class HttpClient {
  abstract get<T>(url: string, options?: RequestInit): Promise<T>;
  abstract post<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  abstract put<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  abstract delete<T>(url: string, options?: RequestInit): Promise<T>;
}
