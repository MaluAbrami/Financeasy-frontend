import { useState } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { TextField } from "../../components/ui/TextField";
import { Link } from "react-router-dom";


export function Login() {
    const [form, setForm] = useState({email: "", password: ""});
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }

    function validate() {
        const e: typeof errors = {};
        if(!form.email.trim()) e.email = "Informe seu e-mail.";
        if(!form.password.trim()) e.password = "Informe sua senha.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");

        if(!validate()) return;

        try {
            setLoading(true);

            // TODO: chamar api de login

            console.log("login payload", form);
        } catch {
            setServerError("Não foi possível entrar. Verifique seus dados e tente novamente.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout title="Entrar" subtitle="Acesse sua conta para continuar seu controle financeiro.">
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeHolder="seuemail@exemplo.com"
                    autoComplete="email"
                    error={errors.email}
                />

                <TextField
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeHolder="Sua senha"
                    autoComplete="current-password"
                    error={errors.password}
                />

                {serverError && (
                    <div>
                        {serverError}
                    </div>
                )}

                <button className="btn btn-primary">
                    {loading ? "Entrando..." : "Entrar"}
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