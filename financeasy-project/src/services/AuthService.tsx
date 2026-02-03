

export const authService = {
    async login(email:string, password: string) {
        return { token: "fake-token" };
    },

    async register(email:string, password:string) {
        return { ok: true };
    }
}