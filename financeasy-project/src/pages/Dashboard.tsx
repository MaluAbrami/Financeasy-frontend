import { useState } from "react";
import { NavBar } from "../components/layout/NavBar";

export type Account = {
    bank: string;
    balance: number;
}

export type Card = {
    name: string;
    availableLimit: number;
    totalLimit: number;
}

export type Table = {
    transactions: Transaction[];
}

export type Transaction = {
    value: number;
    type: "Expensive" | "Income";
    description: string;
    date: string;
}

export function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [cards, setCards] = useState([]);
    const [table, setTable] = useState([]);

    return (
        <>
            <section className="flex flex-col md:flex-row w-full">
                <NavBar/>
                <div className="flex flex-col md:flex-col w-full h-full md:h-screen gap-8 p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div>
                            <p>Suas contas</p>
                            <ul>
                                <li>{accounts}</li>
                            </ul>
                        </div>

                        <div>
                            <p>Seus cartões</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between">
                        <div>
                            <p>Aqui vai ficar mais um gráfico</p>
                        </div>
                        <div>
                            <p>Aqui vai ficar o gráfico com a porcentagem do seu gasto do mês</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center">
                        <div>
                            <p>Aqui vai ficar a tabela com gastos do mês já lançados ou planejados mensais esperados</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}