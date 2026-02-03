import { authStorage } from "../storage/auth.storage";

const API_URL = import.meta.env.VITE_API_URL;

type ApiOptions = RequestInit & {
    auth?: boolean;
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const { auth = true, headers, ...rest} = options;

    const finalHeaders = new Headers(options.headers);

    const hasBody = rest.body !== undefined && rest.body !== null;

    if(hasBody && !(rest.body instanceof FormData) && !finalHeaders.has("Content-Type")) {
        finalHeaders.set("Content-Type", "application/json");
    }

    if(rest.body instanceof FormData) {
        finalHeaders.delete("Content-Type");
    }

    if (auth) {
        const token = authStorage.getAccessToken();
        if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: finalHeaders,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

    if(!res.ok) {
        const message = 
            (body && typeof body === "object" && "message" in body && (body as any).message) ||
            (typeof body === "string" && body) ||
            `Erro ${res.status}`;

        throw { status: res.status, message, body };
    }

    return body as T;
};

export const apiClient = {
    get: <T>(path: string, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "GET" }),
    
    post: <T>(path: string, data?: any, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "POST", body: JSON.stringify(data ?? {}) }),

    put: <T>(path: string, data?: any, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "PUT", body: JSON.stringify(data ?? {}) }),

    del: <T>(path: string, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "DELETE" }),
};