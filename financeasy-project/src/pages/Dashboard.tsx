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
    setMonthAlert,
    setYearAlert,
    loadAccounts,
  } = useDashboardData();

  return (
    <section className="flex w-full min-h-screen">

      <NavBar />

      <div className="flex flex-col w-full gap-8 p-6">

        <AccountsCard
          accounts={accounts?.banksAccounts ?? []}
          pagination={accounts?.pagination ?? { totalPages: 1, page: 1, pageSize: 10, totalItems: 0 }}
          loadAccounts={loadAccounts}
        />

        <AlertsCard
          alerts={alerts?.alerts ?? []}
          month={monthAlert}
          year={yearAlert}
          setMonth={setMonthAlert}
          setYear={setYearAlert}
        />

        <ExpenseIncomeChart
          totalExpense={1200}
          totalIncome={2500}
        />

      </div>

      <MonthlyEntriesSection
        bankAccounts={accounts?.banksAccounts ?? []}
        cards={cards?.cards ?? []}
        categories={categories?.categorys ?? []}
        onSubmitTransactions={async (payload) => {
          await Promise.all(payload.map((p) => transactionService.create(p)));
        }}
        onSubmitCardPurchases={async (payload) => {
          await Promise.all(payload.map((p) => cardPurchaseService.create(p)));
        }}
      />

    </section>
  );
}