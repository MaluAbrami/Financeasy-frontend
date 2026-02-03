import { NavBar } from "../components/layout/NavBar";


export function Dashboard() {
    return (
        <>
            <section className="flex w-full">
                <NavBar/>
                <div>
                    <div>
                        <p>Suas contas</p>
                    </div>

                    <div>
                        <p>Seus cartões</p>
                    </div>

                    <div>
                        <p>Aqui vai ficar o gráfico com a porcentagem do seu gasto do mês</p>
                    </div>
                </div>
            </section>
        </>
    );
}