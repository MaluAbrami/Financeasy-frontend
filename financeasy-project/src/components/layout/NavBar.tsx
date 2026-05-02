import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

export function NavBar() {

  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <section
      className="
        flex flex-row md:flex-col
        bg-card border-r border-border
        w-full md:w-64
        h-auto md:min-h-screen
        justify-between
      "
    >

      {/* Top */}
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

      {/* Bottom */}
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
  );
}