import { apiClient } from "./ApiClient";

const path = "/users"

export const authService = {
    async login(email:string, password: string) {
        const response = await apiClient.post<string>(
            `${path}/login`,
            { email, password },
            { auth: false }
        );

        return response;
    },

    async register(email: string, password: string) {
        return apiClient.post(
        `${path}/register`,
        { email, password },
        { auth: false }
        );
    },
}