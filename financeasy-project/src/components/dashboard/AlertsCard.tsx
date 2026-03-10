import type { AlertResponse } from "@/models/alert/AlertResponse";
import { formatDateBR } from "@/util/FormatDateBR";

interface AlertsProps {
  alerts: AlertResponse[];
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

export function AlertsCard({
  alerts,
  month,
  year,
  setMonth,
  setYear,
}: AlertsProps) {

  const alertsCols = "grid-cols-[1fr_auto_auto]";

  return (
    <div className="bg-card border border-border p-6 rounded-2xl w-full">

      <div className="flex justify-between mb-4">

        <h2 className="text-xl font-semibold">Contas a pagar</h2>

        <div className="flex gap-2">

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >

            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2024, m - 1).toLocaleString("pt-BR", { month: "long" })}
              </option>
            ))}

          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >

            {Array.from({ length: 10 }, (_, i) =>
              new Date().getFullYear() - 2 + i
            ).map((y) => (
              <option key={y}>{y}</option>
            ))}

          </select>

        </div>

      </div>

      {alerts?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum alerta para esse mês.
        </p>
      )}

      {alerts?.length ? (

        <div className="mt-3">

          <div className={`grid ${alertsCols} gap-4 text-xs font-semibold border-b pb-2`}>

            <span>Categoria</span>
            <span className="text-right">Valor esperado</span>
            <span className="text-right">Data de vencimento</span>

          </div>

          <ul className="mt-2 flex flex-col">

            {alerts.map((alert) => (

              <li
                key={alert.id}
                className={`grid ${alertsCols} gap-4 py-3 border-b`}
              >

                <span>{alert.categoryName}</span>

                <span className="text-right font-semibold">

                  {alert.expectedAmount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}

                </span>

                <span className="text-right">
                  {formatDateBR(alert.dueDate)}
                </span>

              </li>

            ))}

          </ul>

        </div>

      ) : null}

    </div>
  );
}