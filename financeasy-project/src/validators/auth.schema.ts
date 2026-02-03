import z from "zod";


export const loginSchema = z.object({
    email: z.string().min(1, "Informe seu email.").email("Email inválido."),
    password: z.string().min(1, "Informe sua senha."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        email: z.string().min(1, "Informe seu email.").email("Email inválido."),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
        confirmPassword: z.string().min(1, "Confirme sua senha"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;