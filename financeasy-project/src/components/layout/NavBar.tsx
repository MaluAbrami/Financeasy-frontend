import { useAuth } from "../../contexts/AuthContext";

export function NavBar() {
    const { logout } = useAuth();

    return (
        <>
            <section className="flex flex-col bg-surface w-1/12 h-screen justify-between">
                <div className="flex flex-col justify-center items-center gap-3 p-4">
                    <button className="btn btn-primary w-full">Geral</button>
                    <button className="btn btn-primary w-full">Cartões</button>
                </div>
                <div className="flex flex-col justify-center items-center gap-3 p-4">
                    <button className="btn btn-primary w-full">Minha conta</button>
                    <button className="btn btn-primary w-full" onClick={logout}>Sair</button>
                </div>
            </section>
        </>
    )
}