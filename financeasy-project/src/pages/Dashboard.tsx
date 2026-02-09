import { useEffect, useState } from "react";
import { NavBar } from "../components/layout/NavBar";
import type { GetAllBanksAccounts } from "../models/bankAccount/GetAllBanksAccounts";
import { bankAccountService } from "../services/BankAccountService";
import type { PaginationRequest } from "../models/pagination/PaginationRequest";
import type { GetAllCards } from "../models/card/GetAllCards";
import { cardService } from "../services/CardService";
import type { GetAllTransactions } from "../models/transaction/GetAllTransactions";
import { transactionService } from "../services/TransactionService";
import { formatDateBR } from "../util/FormatDateBR";

export function Dashboard() {
    const [allBankAccounts, setAllBankAccounts] = useState<GetAllBanksAccounts | null>(null);
    const [loadingAccounts, setLoadingAccounts] = useState(false);
    const [errorAccounts, setErrorAccounts] = useState<string | null>(null);
    const [balanceVisibleById, setBalanceVisibleById] = useState<Record<string, boolean>>({});

    const [allCards, setAllCards] = useState<GetAllCards | null>(null);
    const [loadingCards, setLoadingCards] = useState(false);
    const [errorCards, setErrorCards] = useState<string | null>(null);

    const [allTransactions, setAllTransactions] = useState<GetAllTransactions | null>(null);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [errorTransactions, setErrorTransactions] = useState<string | null>(null);

    const toggleBalance = (id: string) => {
    setBalanceVisibleById(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        async function loadAccounts() {
            try {
                setLoadingAccounts(true);
                setErrorAccounts(null);

                const pagination: PaginationRequest = {
                    page: 1,
                    pageSize: 2,
                    orderBy: "Balance",
                    direction: "Desc"
                };

                const response = await bankAccountService.getAll(pagination);

                setAllBankAccounts(response);
            } catch(err) {
                console.log("ERRO getAll bank accounts:", err);
                setErrorAccounts("Não foi possível carregar suas contas.");
            } finally {
                setLoadingAccounts(false);
            }
        }

        async function loadCards() {
            try {
                setLoadingCards(true);
                setErrorCards(null);

                const pagination: PaginationRequest = {
                    page: 1,
                    pageSize: 2,
                    orderBy: "CreditLimit",
                    direction: "Desc"
                };

                const response = await cardService.getAll(pagination);

                setAllCards(response);
            } catch(err) {
                console.log("ERRO getAll cards:", err);
                setErrorCards("Não foi possível carregar seus cartões de crédito.");
            } finally {
                setLoadingCards(false);
            }
        }

        async function loadTransactions() {
            try {
                setLoadingTransactions(true);
                setErrorTransactions(null);

                const pagination: PaginationRequest = {
                    page: 1,
                    pageSize: 5,
                    orderBy: "Date",
                    direction: "Desc"
                }

                const response = await transactionService.getAll(pagination);

                setAllTransactions(response);
            } catch (err) {
                setErrorTransactions("Não foi possível carregar suas transações recentes");
            } finally {
                setLoadingTransactions(false);
            }
        }

        loadAccounts();
        loadCards();
        loadTransactions();
    }, []);

    return (
        <>
            <section className="flex flex-col md:flex-row w-full">
                <NavBar/>
                <div className="flex flex-col md:flex-col w-full h-full md:h-screen gap-8 p-4">
                    <div className="flex flex-col md:flex-row w-full gap-10">
                        <div className="bg-surface p-6 rounded-2xl w-full">
                            <h2 className="mb-4 text-3x1 w-full md:w-48">Suas contas</h2>

                            {loadingAccounts && <p>Carregando...</p>}

                            {errorAccounts && <p>{errorAccounts}</p>}

                            {!loadingAccounts && !errorAccounts && allBankAccounts?.banksAccounts?.length === 0 && <p>Você ainda não tem contas bancárias cadastradas.</p>}

                            {!loadingAccounts && !errorAccounts && allBankAccounts?.banksAccounts.length ? (
                                <ul className="flex flex-col">
                                    {allBankAccounts.banksAccounts.map((acc) => {
                                    const isVisible = !!balanceVisibleById[acc.id];

                                    return (
                                        <li key={acc.id} className="p-3 rounded-2xl w-full gap-3">
                                            <div>
                                                <span className="font-bold">{acc.bank}</span>
                                                <br />
                                            </div>

                                            <div className="flex gap-2">
                                                {!isVisible ? (
                                                    <span className="font-semibold">R$ *******</span>
                                                ) : (
                                                    <span className="font-semibold">
                                                    {acc.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() => toggleBalance(acc.id)}
                                                    className="text-xs text-text-muted hover:text-text transition"
                                                >
                                                    {isVisible ? "Ocultar" : "Mostrar"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                    })}
                                </ul>
                            ) : null }

                            {!loadingAccounts && !errorAccounts && allBankAccounts?.pagination && (
                                <div className="flex gap-4 mt-4">
                                    <p className="text-sm">
                                        Página: {allBankAccounts.pagination.page}
                                    </p>
                                    <p className="text-sm">
                                        Total: {allBankAccounts.pagination.totalItems}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-surface p-6 rounded-2xl w-full">
                            <h2 className="mb-4 text-3x1 w-full md:w-48">Seus cartões</h2>

                            {loadingCards && <p>Carregando...</p>}

                            {!loadingCards && errorCards && <p>{errorCards}</p>}

                            {!loadingCards && !errorCards && allCards?.cards.length === 0 && <p>Você ainda não tem cartões de crédito cadastrados</p>}

                            {!loadingCards && !errorCards && allCards?.cards.length ? (
                                <ul className="flex flex-col gap-2">
                                    {allCards.cards.map((card) => {
                                        return (
                                            <li className="flex flex-col md:flex-row border p-6 rounded-2xl h-full w-full justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{card.name}</span>
                                                    <span className="text-sm text-text-muted">Banco: {card.bankAccountName}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-text-muted">Limite: {card.creditLimit}</span>
                                                    <span className="text-sm font-semibold text-text-muted">Disponível: {card.availableLimit}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-text-muted">Fechamento: {card.closingDay}</span>
                                                    <span className="text-sm font-semibold text-text-muted">Vencimento: {card.dueDay}</span>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ): null }
                        </div>

                        <div className="bg-surface p-6 rounded-2xl w-full">
                            <h2 className="mb-4 text-3x1 w-full md:w-48">Recentes</h2>

                            {loadingTransactions && <p>Carregando...</p>}

                            {!loadingTransactions && errorTransactions && <p>{errorTransactions}</p>}

                            {!loadingTransactions && !errorTransactions && allTransactions?.transactions.length === 0 && <p>Você ainda não cadastrou nenhuma transação.</p>}

                            {!loadingTransactions && !errorTransactions && allTransactions?.transactions?.length ? (
                            <div className="mt-3">
                                {/* Header */}
                                <div className="grid grid-cols-[1.2fr_1fr_.9fr_1fr_.9fr] gap-3 text-xs font-semibold text-text-muted pb-2 border-b border-muted">
                                <span>Banco</span>
                                <span>Categoria</span>
                                <span>Método</span>
                                <span className="text-right">Valor</span>
                                <span className="text-right">Data</span>
                                </div>

                                {/* Rows */}
                                <ul className="mt-2 flex flex-col">
                                    {allTransactions.transactions.map((trans) => (
                                        <li
                                        key={trans.id}
                                        className="grid grid-cols-[1.2fr_1fr_.9fr_1fr_.9fr] gap-3 py-2 items-center border-b border-muted/60 last:border-b-0"
                                        >
                                        <span className="truncate">{trans.bankAccountName}</span>
                                        <span className="truncate">{trans.categoryName}</span>
                                        <span className="truncate">{trans.paymentMethod}</span>
                                        <span className="text-right font-semibold">
                                            {trans.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                        <span className="text-right">{formatDateBR(trans.date)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between">
                        <div>
                            <p>Expectativas do mês</p>
                        </div>
                        <div>
                            <p>Aqui vai ficar o gráfico com a porcentagem do seu gasto do mês em relação a renda</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center">
                        <div>
                            <p>Aqui vai ficar a tabela para realizar o cadastro de transações referentes ao mês</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}