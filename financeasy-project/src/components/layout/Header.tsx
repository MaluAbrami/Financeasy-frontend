import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="mx-auto max-w-6xl w-full px-6 pt-6">
      <nav className="flex items-center justify-between">
        <Link to="/" className="text-3xl font-semibold text-foreground">
          Financeasy
        </Link>

        <ul className="hidden md:flex gap-6 text-sm">
          {["Início", "Sobre", "Serviços", "Contato"].map((item) => (
            <li key={item} className="relative group">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                {item}
              </a>
              <span
                className="
                  absolute left-0 -bottom-1 h-[2px] w-0
                  bg-primary transition-all duration-300
                  group-hover:w-full
                "
              />
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link to="/register">Cadastrar</Link>
          </Button>

          <Button asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
