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
import type { GetAllCategories } from "@/models/category/GetAllCategories";
import { categoryService } from "@/services/CategoryService";
import { MonthlyEntriesSection } from "@/components/layout/MonthlyEntriesSection";
import { cardPurchaseService } from "@/services/CardPurchaseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "react-router-dom";
import type { CreateBankAccount } from "@/models/bankAccount/CreateBankAccount";

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

  const [allCategories, setAllCategories] = useState<GetAllCategories | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);

  const [createBankAccount, setCreateBankAccount] = useState<CreateBankAccount>({
    bank: "",
    balance: 0,
  });

  const toggleBalance = (id: string) => {
    setBalanceVisibleById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoadingAccounts(true);
        setErrorAccounts(null);

        const pagination: PaginationRequest = {
          page: 1,
          pageSize: 5,
          orderBy: "Balance",
          direction: "Desc",
        };

        const response = await bankAccountService.getAll(pagination);
        setAllBankAccounts(response);
      } catch (err) {
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
          direction: "Desc",
        };

        const response = await cardService.getAll(pagination);
        setAllCards(response);
      } catch (err) {
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
          pageSize: 4,
          orderBy: "Date",
          direction: "Desc",
        };

        const response = await transactionService.getAll(pagination);
        setAllTransactions(response);
      } catch (err) {
        setErrorTransactions("Não foi possível carregar suas transações recentes");
      } finally {
        setLoadingTransactions(false);
      }
    }

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        setErrorCategories(null);

        const pagination: PaginationRequest = {
          page: 1,
          pageSize: 50,
          orderBy: "Name",
          direction: "Asc",
        };

        const response = await categoryService.getAll(pagination);
        setAllCategories(response);
      } catch (err) {
        console.log("ERRO getAll categories:", err);
        setErrorCategories("Não foi possível carregar suas categorias.");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadAccounts();
    loadCards();
    loadTransactions();
    loadCategories();
  }, []);

  async function createNewBankAccount() {
    try {
      if (!createBankAccount.bank.trim()) {
        setErrorAccounts("Informe o nome do banco.");
        return;
      }

      await bankAccountService.create(createBankAccount);

      // fecha form, limpa campos, recarrega lista
      setShowAddAccount(false);
      setCreateBankAccount({ bank: "", balance: 0 });

      // recarrega
      const pagination: PaginationRequest = {
        page: 1,
        pageSize: 5,
        orderBy: "Balance",
        direction: "Desc",
      };

      const response = await bankAccountService.getAll(pagination);
      setAllBankAccounts(response);
    } catch (err) {
      console.log("Erro ao criar conta:", err);
      setErrorAccounts("Não foi possível criar a conta.");
    }
  }

  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen">
      <NavBar />

      <div className="flex flex-col w-full gap-8 p-6">
        <div className="flex flex-col xl:flex-row w-full gap-6">
          {/* Contas */}
          <div className="bg-card border border-border p-6 rounded-2xl w-full">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Suas contas</h2>

            {loadingAccounts && <p className="text-sm text-muted-foreground">Carregando...</p>}
            {errorAccounts && <p className="text-sm text-destructive">{errorAccounts}</p>}

            {!loadingAccounts && !errorAccounts && allBankAccounts?.banksAccounts?.length === 0 && (
              <p className="text-sm text-muted-foreground">Você ainda não tem contas bancárias cadastradas.</p>
            )}

            {!loadingAccounts && !errorAccounts && allBankAccounts?.banksAccounts.length ? (
              <ul className="flex flex-col">
                {allBankAccounts.banksAccounts.map((acc) => {
                  const isVisible = !!balanceVisibleById[acc.id];

                  return (
                    <li key={acc.id} className="p-3 rounded-2xl w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{acc.bank}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {!isVisible ? (
                          <span className="font-semibold text-foreground">R$ *******</span>
                        ) : (
                          <span className="font-semibold text-foreground">
                            {acc.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                        )}

                        <button
                          onClick={() => toggleBalance(acc.id)}
                          className="text-xs text-muted-foreground hover:text-foreground transition"
                        >
                          {isVisible ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {!loadingAccounts && !errorAccounts && allBankAccounts?.pagination && (
              <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                <p>Página: {allBankAccounts.pagination.page}</p>
                <p>Total: {allBankAccounts.pagination.totalItems}</p>
              </div>
            )}

            <div className="mt-3">
              {showAddAccount && (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createNewBankAccount();
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Nome do banco"
                    value={createBankAccount.bank}
                    onChange={(e) =>
                      setCreateBankAccount((prev) => ({ ...prev, bank: e.target.value }))
                    }
                  />

                  <Input
                    inputMode="decimal"
                    placeholder="0,00"
                    value={String(createBankAccount.balance)}
                    onChange={(e) => {
                      const normalized = e.target.value.replace(/\./g, "").replace(",", ".");
                      const value = Number(normalized);
                      setCreateBankAccount((prev) => ({
                        ...prev,
                        balance: Number.isFinite(value) ? value : 0,
                      }));
                    }}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" variant="outline" size="sm">
                      Salvar
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowAddAccount(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}

              {!showAddAccount && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAccount(true)}
                >
                  Adicionar conta
                </Button>
              )}
            </div>
          </div>

          {/* Cartões */}
          <div className="bg-card border border-border p-6 rounded-2xl w-full">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Seus cartões</h2>

            {loadingCards && <p className="text-sm text-muted-foreground">Carregando...</p>}
            {!loadingCards && errorCards && <p className="text-sm text-destructive">{errorCards}</p>}

            {!loadingCards && !errorCards && allCards?.cards.length === 0 && (
              <p className="text-sm text-muted-foreground">Você ainda não tem cartões de crédito cadastrados</p>
            )}

            {!loadingCards && !errorCards && allCards?.cards.length ? (
              <ul className="flex flex-col gap-3">
                {allCards.cards.map((card) => (
                  <li key={card.id} className="flex flex-col md:flex-row border border-border p-6 rounded-2xl w-full justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-foreground font-semibold">{card.name}</span>
                      <span className="text-sm text-muted-foreground">Banco: {card.bankAccountName}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Limite: {card.creditLimit}
                      </span>
                      <span className="text-sm font-semibold text-muted-foreground">
                        Disponível: {card.availableLimit}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-muted-foreground">Fechamento: {card.closingDay}</span>
                      <span className="text-sm font-semibold text-muted-foreground">Vencimento: {card.dueDay}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Recentes */}
          <div className="bg-card border border-border p-6 rounded-2xl w-full">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recentes</h2>

            {loadingTransactions && <p className="text-sm text-muted-foreground">Carregando...</p>}
            {!loadingTransactions && errorTransactions && <p className="text-sm text-destructive">{errorTransactions}</p>}

            {!loadingTransactions && !errorTransactions && allTransactions?.transactions.length === 0 && (
              <p className="text-sm text-muted-foreground">Você ainda não cadastrou nenhuma transação.</p>
            )}

            {!loadingTransactions && !errorTransactions && allTransactions?.transactions?.length ? (
              <div className="mt-3">
                <div className="grid grid-cols-[1.2fr_1fr_.9fr_1fr_.9fr] gap-3 text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
                  <span>Banco</span>
                  <span>Categoria</span>
                  <span>Método</span>
                  <span className="text-right">Valor</span>
                  <span className="text-right">Data</span>
                </div>

                <ul className="mt-2 flex flex-col">
                  {allTransactions.transactions.map((trans) => (
                    <li
                      key={trans.id}
                      className="grid grid-cols-[1.2fr_1fr_.9fr_1fr_.9fr] gap-3 py-2 items-center border-b border-border/60 last:border-b-0"
                    >
                      <span className="truncate text-foreground">{trans.bankAccountName}</span>
                      <span className="truncate text-foreground">{trans.categoryName}</span>
                      <span className="truncate text-foreground">{trans.paymentMethod}</span>
                      <span className="text-right font-semibold text-foreground">
                        {trans.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                      <span className="text-right text-foreground">{formatDateBR(trans.date)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl w-full">
            <p className="text-foreground font-semibold">Expectativas do mês</p>
            <p className="text-sm text-muted-foreground mt-2">Conteúdo em construção.</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl w-full">
            <p className="text-foreground font-semibold">Gasto do mês x Renda</p>
            <p className="text-sm text-muted-foreground mt-2">
              Aqui vai ficar o gráfico com a porcentagem do seu gasto do mês em relação a renda.
            </p>
          </div>
        </div>

        <MonthlyEntriesSection
          bankAccounts={allBankAccounts?.banksAccounts ?? []}
          cards={allCards?.cards ?? []}
          categories={allCategories?.categorys ?? []}
          onSubmitTransactions={async (payload) => {
            await Promise.all(payload.map((p) => transactionService.create(p)));
          }}
          onSubmitCardPurchases={async (payload) => {
            await Promise.all(payload.map((p) => cardPurchaseService.create(p)));
          }}
        />
      </div>
    </section>
  );
}
