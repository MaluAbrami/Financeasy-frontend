import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { TextField } from "../../components/ui/TextField";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterFormData } from "../../validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "../../components/ui/PasswordField";
import { Button } from "@/components/ui/button";
import { authService } from "../../services/AuthService";

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: RegisterFormData) {
    await authService.register(data.email, data.password, null, 0);
    console.log("register payload", data);
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a organizar suas finanças em poucos minutos.">
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          label="Confirme senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Já possui uma conta?{" "}
          <Link className="text-primary hover:underline" to="/login">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
