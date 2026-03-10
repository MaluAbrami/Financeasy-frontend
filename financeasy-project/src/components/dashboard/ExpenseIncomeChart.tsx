interface ExpenseIncomeChartProps {
  totalExpense: number;
  totalIncome: number
}

export function ExpenseIncomeChart({ totalExpense, totalIncome }: ExpenseIncomeChartProps) {

  const percent =
    totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;

  return (
    <div className="bg-card border border-border p-6 rounded-2xl w-full">

      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Gastos x Renda
          </h2>
          <p className="mb-4">Valor gasto em relação a renda no mês</p>
        </div>

        <p>Renda total do mês: {totalIncome.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      <div className="flex flex-col gap-4">

        <div>

          <p className="font-semibold text-sm mb-1">Gastos</p>

          <div className="w-full h-6 bg-muted rounded-lg overflow-hidden">

            <div
              className="h-full bg-red-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p>{totalExpense.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
        </div>

        <div>

          <p className="font-semibold text-sm mb-1">Disponível</p>

          <div className="w-full h-6 bg-muted rounded-lg overflow-hidden">

            <div
              className="h-full bg-green-500"
              style={{ width: `${100 - percent}%` }}
            />
            
          </div>
          <p>{(totalIncome - totalExpense).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
        </div>

      </div>

    </div>
  );
}