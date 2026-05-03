import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wallet } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path: string) {
    return location.pathname === path;
  }

  function handleNavigate(path: string) {
    navigate(path);
    setIsMobileMenuOpen(false);
  }

  function handleLogout() {
    setIsMobileMenuOpen(false);
    logout();
  }

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Financeasy</p>
              <p className="text-xs text-muted-foreground">Painel financeiro</p>
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        id="mobile-navigation"
        className={`
          md:hidden fixed top-0 left-0 z-50 h-dvh w-[82%] max-w-xs
          border-r border-border bg-card shadow-2xl
          transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <section className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-3 p-4 pt-5">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Wallet className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold">Menu</p>
            </div>

            <Button
              className="w-full justify-start"
              variant={isActive("/dashboard") ? "default" : "outline"}
              onClick={() => handleNavigate("/dashboard")}
            >
              Dashboard
            </Button>

            <Button
              className="w-full justify-start"
              variant={isActive("/entries") ? "default" : "outline"}
              onClick={() => handleNavigate("/entries")}
            >
              Lançamentos
            </Button>

            <Button
              className="w-full justify-start"
              variant={isActive("/cards") ? "default" : "outline"}
              onClick={() => handleNavigate("/cards")}
            >
              Cartões
            </Button>

            <Button
              className="w-full justify-start"
              variant={isActive("/simulations") ? "default" : "outline"}
              onClick={() => handleNavigate("/simulations")}
            >
              Simulações
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-t border-border p-4">
            <Button
              className="w-full justify-start"
              variant={isActive("/account") ? "default" : "outline"}
              onClick={() => handleNavigate("/account")}
            >
              Minha conta
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </section>
      </aside>

      {/* Desktop sidebar */}
      <section
        className="
          hidden md:flex md:flex-col
          bg-card border-r border-border
          w-64 min-h-screen
          justify-between
        "
      >
        <div className="flex flex-col justify-center items-center gap-3 p-4 w-full">
          <Button
            className="w-full"
            variant={isActive("/dashboard") ? "default" : "outline"}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>

          <Button
            className="w-full"
            variant={isActive("/entries") ? "default" : "outline"}
            onClick={() => navigate("/entries")}
          >
            Lançamentos
          </Button>

          <Button
            className="w-full"
            variant={isActive("/cards") ? "default" : "outline"}
            onClick={() => navigate("/cards")}
          >
            Cartões
          </Button>

          <Button
            className="w-full"
            variant={isActive("/simulations") ? "default" : "outline"}
            onClick={() => navigate("/simulations")}
          >
            Simulações
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 p-4 w-full">
          <Button
            className="w-full"
            variant={isActive("/account") ? "default" : "outline"}
            onClick={() => navigate("/account")}
          >
            Minha conta
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={logout}
          >
            Sair
          </Button>
        </div>
      </section>
    </>
  );
}