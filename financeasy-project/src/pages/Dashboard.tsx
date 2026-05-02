import { NavBar } from "@/components/layout/NavBar";

import { useDashboardData } from "@/hooks/useDashboardData";

import { AccountsCard } from "@/components/dashboard/AccountCard";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { ExpenseIncomeChart } from "@/components/dashboard/ExpenseIncomeChart";

import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, TrendingUp, Bell } from "lucide-react";

export function Dashboard() {

  const navigate = useNavigate();

  const {
    accounts,
    categories,
    alerts,

    monthAlert,
    yearAlert,
    spedingMonthlyControl,
    setMonthAlert,
    setYearAlert,
    loadAccounts,
    loadAlerts,
  } = useDashboardData();

  return (
    <section className="flex w-full h-screen overflow-hidden">

      {/* NAVBAR FIXO */}
      <NavBar />

      {/* CONTEÚDO COM SCROLL */}
      <div className="flex flex-col w-full gap-6 p-4 md:p-6 overflow-y-auto">

        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>
          <p className="text-muted-foreground">Aqui está um resumo da sua situação financeira</p>
        </div>

        {/* Cards de Navegação Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => navigate("/entries")}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:scale-105"
          >
            <FileText className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Lançamentos</h3>
            <p className="text-sm text-muted-foreground">Registre transações e compras</p>
          </div>

          <div 
            onClick={() => navigate("/cards")}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:scale-105"
          >
            <CreditCard className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Cartões</h3>
            <p className="text-sm text-muted-foreground">Gerencie seus cartões de crédito</p>
          </div>

          <div 
            onClick={() => navigate("/simulations")}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:scale-105"
          >
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Simulações</h3>
            <p className="text-sm text-muted-foreground">Simule cenários financeiros</p>
          </div>

          <div 
            onClick={() => window.scrollTo(0, document.body.scrollHeight)}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:scale-105"
          >
            <Bell className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Lembretes</h3>
            <p className="text-sm text-muted-foreground">Veja seus compromissos</p>
          </div>

        </div>

        {/* Seções principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* Contas Bancárias */}
          <div className="lg:col-span-2">
            <AccountsCard
              accounts={accounts?.banksAccounts ?? []}
              pagination={accounts?.pagination ?? { totalPages: 1, page: 1, pageSize: 10, totalItems: 0 }}
              loadAccounts={loadAccounts}
            />
          </div>

          {/* Gráfico de Despesas vs Receitas */}
          <div>
            <ExpenseIncomeChart
              totalExpense={spedingMonthlyControl?.totalExpense ?? 0}
              totalIncome={spedingMonthlyControl?.totalIncome ?? 0}
            />
          </div>

        </div>

        {/* Lembretes */}
        <div>
          <AlertsCard
            alerts={alerts?.alerts ?? []}
            month={monthAlert}
            year={yearAlert}
            setMonth={setMonthAlert}
            setYear={setYearAlert}
            categories={categories?.categorys ?? null}
            pagination={alerts?.pagination ?? { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 }}
            loadAlerts={loadAlerts}
          />
        </div>

      </div>

    </section>
  );
}