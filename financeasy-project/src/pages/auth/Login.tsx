import { useState } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { TextField } from "../../components/ui/TextField";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../../validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "../../components/ui/PasswordField";


export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(data: LoginFormData) {
        console.log("login payload", data);
    }

    return (
        <AuthLayout title="Entrar" subtitle="Acesse sua conta para continuar seu controle financeiro.">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Email"
                    placeHolder="seuemail@exemplo.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <PasswordField
                    label="Senha"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <button className="btn btn-primary">
                    {isSubmitting ? "Entrando..." : "Entrar"}
                </button>

                <p className="text-sm text-text-muted text-center">
                    Ainda não tem conta?{" "}
                    <Link className="text-primary hover:underline" to="/register">
                        Criar conta
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}