import { NavBar } from "@/components/layout/NavBar";
import { MonthlyEntriesSection } from "@/components/layout/MonthlyEntriesSection";

import { useDashboardData } from "@/hooks/useDashboardData";

import { transactionService } from "@/services/TransactionService";
import { cardPurchaseService } from "@/services/CardPurchaseService";

export function Entries() {

  const {
    accounts,
    cards,
    categories,
    refreshDashboard
  } = useDashboardData();

  return (
    <section className="flex flex-col md:flex-row w-full h-screen overflow-hidden">

      {/* NAVBAR FIXO */}
      <NavBar />

      {/* CONTEÚDO COM SCROLL */}
      <div className="flex flex-col w-full gap-5 md:gap-6 p-4 md:p-6 overflow-y-auto">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Lançamentos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Registre suas transações e compras com cartão</p>
        </div>

        <MonthlyEntriesSection
          bankAccounts={accounts?.banksAccounts ?? []}
          cards={cards?.cards ?? []}
          categories={categories?.categorys ?? []}
          onSubmitTransactions={async (payload) => {
            await Promise.all(payload.map((p) => transactionService.create(p)));
            await refreshDashboard();
          }}
          onSubmitCardPurchases={async (payload) => {
            await Promise.all(payload.map((p) => cardPurchaseService.create(p)));
          }}
          refreshDashboard={async () =>{
            await refreshDashboard()
          }}
        />

      </div>

    </section>
  );
}