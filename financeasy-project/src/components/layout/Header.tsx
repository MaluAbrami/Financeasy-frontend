

export function Header() {
    return (
        <>
            <section className="m-3">
                <nav className="flex justify-between items-center">
                    <a href="" className="text-4xl">Financeasy</a>

                    <ul className="flex gap-5">
                        <li className="relative group">
                            <a href="#" className="text-slate-300">
                            Início
                            </a>
                            <span className="
                            absolute left-0 -bottom-1
                            h-[2px] w-0
                            bg-sky-400
                            transition-all duration-300
                            group-hover:w-full
                            " />
                        </li>
                        <li className="relative group">
                            <a href="" className="text-slate-300">
                                Sobre
                            </a>
                            <span className="
                            absolute left-0 -bottom-1
                            h-[2px] w-0
                            bg-sky-400
                            transition-all duration-300
                            group-hover:w-full
                            " />
                        </li>
                        <li className="relative group">
                            <a href="" className="text-slate-300">
                                Serviços
                            </a>
                            <span className="
                            absolute left-0 -bottom-1
                            h-[2px] w-0
                            bg-sky-400
                            transition-all duration-300
                            group-hover:w-full
                            " />
                        </li>
                        <li className="relative group">
                            <a href="" className="text-slate-300">
                                Contato
                            </a>
                            <span className="
                            absolute left-0 -bottom-1
                            h-[2px] w-0
                            bg-sky-400
                            transition-all duration-300
                            group-hover:w-full
                            " />
                        </li>
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