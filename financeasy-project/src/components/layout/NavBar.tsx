import { useAuth } from "../../contexts/AuthContext";

export function NavBar() {
    const { logout } = useAuth();

    return (
        <>
            <section className="flex flex-row md:flex-col bg-surface w-full md:w-64 h-auto md:h-screen justify-between">
                <div className="flex flex-col justify-center items-center gap-3 p-4 w-full">
                    <button className="btn btn-primary w-full">Dashboard</button>
                    <button className="btn btn-primary w-full">Simulações</button>
                </div>
                <div className="flex flex-col justify-center items-center gap-3 p-4 w-full">
                    <button className="btn btn-primary w-full">Minha conta</button>
                    <button className="btn btn-primary w-full" onClick={logout}>Sair</button>
                </div>
            </section>
        </>
    )
}