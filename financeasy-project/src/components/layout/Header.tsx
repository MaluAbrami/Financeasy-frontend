

export function Header() {
    return (
        <>
            <section className="m-3">
                <nav className="flex justify-between items-center">
                    <a href="" className="text-4xl">Financeasy</a>

                    <ul className="flex gap-5">
                        <li><a href="">Início</a></li>
                        <li><a href="">Sobre</a></li>
                        <li><a href="">Serviços</a></li>
                        <li><a href="">Contato</a></li>
                    </ul>

                    <div className="flex gap-5">
                        <button className="btn btn-primary">Cadastrar</button>
                        <button className="btn btn-primary">Entrar</button>
                    </div>
                </nav>
            </section>
        </>
    );
}