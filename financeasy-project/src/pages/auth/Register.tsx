import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { TextField } from "../../components/ui/TextField";
import { useState } from "react";


export function Register() {
    const [form, setForm] = useState({email: "", password: "", limit: 0, profileImage: ""});
    const [errors, setErrors] = useState<{ email?: string; password?: string, limit?: string }>({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }

    function validate() {
        const e: typeof errors = {};
        if(!form.email.trim()) e.email = "Informe seu e-mail.";
        if(!form.password.trim()) e.password = "Informe sua senha.";
        if(!form.limit) e.limit = "Informe um limite mensal de gastos para receber alertas.";
        
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");

        if(!validate()) return;

        try {
            setLoading(true);

            // TODO: chamar api de cadastro

            console.log("register payload", form);
        } catch {
            setServerError("Não foi possível se cadastrar. Verifique seus dados e tente novamente.")
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <>
            <AuthLayout title="Criar conta" subtitle="Comece a organizar suas finanças em poucos minutos.">
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
                        label="Senha"
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
                        {loading ? "Criando conta..." : "Criar conta"}
                    </button>

                    <p className="text-sm text-text-muted text-center">
                        Já possui uma conta?{" "}
                        <Link className="text-primary hover:underline" to="/login">
                            Entrar
                        </Link>
                    </p>
                </form>
            </AuthLayout>
        </>
    );
}