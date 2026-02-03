import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { TextField } from "../../components/ui/TextField";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterFormData } from "../../validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "../../components/ui/PasswordField";


export function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    async function onSubmit(data: RegisterFormData) {
        console.log("register payload", data);
    }
    
    return (
        <>
            <AuthLayout title="Criar conta" subtitle="Comece a organizar suas finanças em poucos minutos.">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Email"
                        placeHolder="seuemail@exemplo.com"
                        autoComplete="email"
                        error={errors.email?.message}
                    />

                    <PasswordField
                        label="Senha"
                        placeholder="Sua senha"
                        autoComplete="new-password"
                        error={errors.password?.message}
                    />

                    <PasswordField
                        label="Confirme senha"
                        placeholder="Repita a senha"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                    />

                    <button className="btn btn-primary">
                        {isSubmitting ? "Criando conta..." : "Criar conta"}
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