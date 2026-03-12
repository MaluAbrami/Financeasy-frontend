import { NavBar } from "@/components/layout/NavBar";
import { MonthlyEntriesSection } from "@/components/layout/MonthlyEntriesSection";

import { useDashboardData } from "@/hooks/useDashboardData";

import { AccountsCard } from "@/components/dashboard/AccountCard";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { ExpenseIncomeChart } from "@/components/dashboard/ExpenseIncomeChart";

import { transactionService } from "@/services/TransactionService";
import { cardPurchaseService } from "@/services/CardPurchaseService";

export function Dashboard() {

  const {
    accounts,
    cards,
    categories,
    alerts,

    monthAlert,
    yearAlert,
    spedingMonthlyControl,
    setMonthAlert,
    setYearAlert,
    loadAccounts,
    refreshDashboard
  } = useDashboardData();

  return (
    <section className="flex w-full h-screen overflow-hidden">

      {/* NAVBAR FIXO */}
      <NavBar />

      {/* CONTEÚDO COM SCROLL */}
      <div className="flex flex-col w-full gap-6 p-4 md:p-6 overflow-y-auto">

        <AccountsCard
          accounts={accounts?.banksAccounts ?? []}
          pagination={accounts?.pagination ?? { totalPages: 1, page: 1, pageSize: 10, totalItems: 0 }}
          loadAccounts={loadAccounts}
        />

        <div className="flex flex-col md:flex-row gap-6">

          <AlertsCard
            alerts={alerts?.alerts ?? []}
            month={monthAlert}
            year={yearAlert}
            setMonth={setMonthAlert}
            setYear={setYearAlert}
          />

          <ExpenseIncomeChart
            totalExpense={spedingMonthlyControl?.totalExpense ?? 0}
            totalIncome={spedingMonthlyControl?.totalIncome ?? 0}
          />

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
        />

      </div>

    </section>
  );
}