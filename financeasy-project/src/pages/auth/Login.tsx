import { useEffect } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { TextField } from "../../components/ui/TextField";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../../validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "../../components/ui/PasswordField";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/AuthService";
import { Button } from "@/components/ui/button";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = (location.state as any)?.from || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    const token = await authService.login(data.email, data.password);
    login(token);
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para continuar seu controle financeiro.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          placeholder="seuemail@exemplo.com"
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Ainda não tem conta?{" "}
          <Link className="text-primary hover:underline" to="/register">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
