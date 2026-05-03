import { ProportionBar } from "../layout/ProportionBar";

interface ExpenseIncomeChartProps {
  totalExpense: number;
  totalIncome: number;
}

export function ExpenseIncomeChart({
  totalExpense,
  totalIncome,
}: ExpenseIncomeChartProps) {
  const available = totalIncome - totalExpense;

  return (
    <div className="bg-card border border-border p-4 md:p-6 rounded-2xl w-full">

      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-4">

        <div>
          <h2 className="text-lg md:text-xl font-semibold">
            Gastos x Renda
          </h2>
          <p className="text-sm text-muted-foreground">
            Distribuição da renda mensal
          </p>
        </div>

        <p className="font-semibold text-sm md:text-base">
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