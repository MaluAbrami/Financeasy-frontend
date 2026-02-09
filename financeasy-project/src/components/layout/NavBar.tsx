import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";

export function NavBar() {
  const { logout } = useAuth();

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
        <Button className="btn btn-primary w-full">Dashboard</Button>
        <Button className="btn btn-primary w-full">Simulações</Button>
      </div>

      {/* Bottom */}
      <div className="flex flex-col justify-center items-center gap-3 p-4 w-full">
        <Button className="btn btn-secondary w-full">Minha conta</Button>

        <Button
          className="btn btn-ghost w-full"
          onClick={logout}
        >
          Sair
        </Button>
      </div>
    </section>
  );
}
