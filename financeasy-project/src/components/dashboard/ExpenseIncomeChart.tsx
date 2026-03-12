import { ProportionBar } from "../layout/ProportionBar";

interface ExpenseIncomeChartProps {
  totalExpense: number;
  totalIncome: number;
}

export function ExpenseIncomeChart({
  totalExpense,
  totalIncome,
}: ExpenseIncomeChartProps) {

  const expensePercent =
    totalIncome > 0
      ? Math.min((totalExpense / totalIncome) * 100, 100)
      : 0;

  const availablePercent =
    totalIncome > totalExpense
      ? 100 - expensePercent
      : 0;

  const available = totalIncome - totalExpense;

  return (
    <div className="bg-card border border-border p-6 rounded-2xl w-full">

      <div className="flex justify-between mb-4">

        <div>
          <h2 className="text-xl font-semibold">
            Gastos x Renda
          </h2>
          <p className="text-sm text-muted-foreground">
            Distribuição da renda mensal
          </p>
        </div>

        <p className="font-semibold">
          Renda total: {totalIncome.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

      </div>

      <ProportionBar
        total={totalIncome}
        used={totalExpense}
        usedColor = "bg-red-800"
        remainingColor = "bg-emerald-700"
      />

      {/* Valores */}
      <div className="flex justify-between mt-4 text-sm">

        <p>
          Gastos: {totalExpense.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        <p className={available < 0 ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
          Saldo: {available.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

      </div>

    </div>
  );
}