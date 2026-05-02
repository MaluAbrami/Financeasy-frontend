import { useEffect, useState } from "react";

import type { AlertResponse } from "@/models/alert/AlertResponse";
import type { PaginationResponse } from "@/models/pagination/PaginationResponse";
import type { CreateAlert } from "@/models/alert/CreateAlert";
import type { CategoryResponse } from "@/models/category/CategoryResponse";

import { RecurrenceType } from "@/models/category/RecurrenceType";

import { formatDateBR } from "@/util/FormatDateBR";

import { alertService } from "@/services/AlertService";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "../ui/popover";

import { Button } from "../ui/button";
import { Trash2, Check } from "lucide-react";

interface AlertsProps {
  alerts: AlertResponse[];
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  pagination?: PaginationResponse | null;
  categories: CategoryResponse[] | null;
  loadAlerts: (page: number, pageSize: number) => Promise<void>;
}

export function AlertsCard({
  alerts,
  month,
  year,
  setMonth,
  setYear,
  pagination,
  categories,
  loadAlerts,
}: AlertsProps) {

  const [page, setPage] = useState<number>(() => pagination?.page ?? 1);
  const pageSize = 2;

  const [newAlert, setNewAlert] = useState<CreateAlert>({
    categoryId: "",
    recurrenceType: RecurrenceType.Monthly,
    dueDate: new Date(),
    expectedAmount: 0,
    startDate: null,
    endDate: null,
  });

  const recurrenceOptions = [
    { label: "Anual", value: RecurrenceType.Annual },
    { label: "Semestral", value: RecurrenceType.Semiannul },
    { label: "Trimestral", value: RecurrenceType.Quarterly },
    { label: "Mensal", value: RecurrenceType.Monthly },
    { label: "Nenhum", value: RecurrenceType.None },
  ];

  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts(page, pageSize);
  }, [month, year, page]);

  // Keep local `page` in sync when server returns pagination info
  useEffect(() => {
    if (pagination && pagination.page && pagination.page !== page) {
      setPage(pagination.page);
    }
  }, [pagination]);

  async function handleCreateAlert() {
    try {
      await alertService.create(newAlert);

      setPage(1);
      await loadAlerts(1, pageSize);

      setNewAlert({
        categoryId: "",
        recurrenceType: RecurrenceType.Monthly,
        dueDate: new Date(),
        expectedAmount: 0,
        startDate: null,
        endDate: null,
      });
    } catch (error) {
      console.error("Erro ao criar novo alerta", error);
    }
  }

  async function handleDeleteAlert(id: string) {
    try {
      await alertService.delete(id);

      setPage(1);
      await loadAlerts(1, pageSize);
    } catch (error) {
      console.error("Erro ao criar novo alerta", error);
    }
  }

  async function handlePayAlert(id: string) {
    try {
      await alertService.payAlert(id);

      setPage(1);
      await loadAlerts(1, pageSize);
    } catch (error) {
      console.error("Erro ao marcar alerta como pago", error);
    }
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl w-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Lembretes — pendências pessoais e recorrentes</h2>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button>+ Alerta</Button>
            </PopoverTrigger>

            <PopoverContent side="bottom" className="w-80">
              <PopoverHeader>
                <p className="text-lg font-semibold">Criar novo alerta</p>

                <div className="flex flex-col gap-3 mt-3">
                  <p>Categoria</p>

                  <select
                    className="border rounded-md px-3 py-2 text-sm bg-secondary text-foreground"
                    value={newAlert.categoryId}
                    onChange={(e) =>
                      setNewAlert((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Selecione uma categoria</option>

                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <p>Tipo de recorrência</p>

                  <select
                    className="border rounded-md px-3 py-2 text-sm bg-secondary text-foreground"
                    value={newAlert.recurrenceType}
                    onChange={(e) =>
                      setNewAlert((prev) => ({
                        ...prev,
                        recurrenceType: e.target.value,
                      }))
                    }
                  >
                    {recurrenceOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <p>Valor esperado</p>

                  <input
                    type="number"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAlert.expectedAmount}
                    onChange={(e) =>
                      setNewAlert((prev) => ({
                        ...prev,
                        expectedAmount: Number(e.target.value),
                      }))
                    }
                  />

                  <p>Data de vencimento</p>

                  <input
                    type="date"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAlert.dueDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewAlert((prev) => ({
                        ...prev,
                        dueDate: new Date(e.target.value),
                      }))
                    }
                  />

                  <p>Data inicial</p>

                  <input
                    type="date"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={
                      newAlert.startDate
                        ? newAlert.startDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewAlert((prev) => ({
                        ...prev,
                        startDate: new Date(e.target.value),
                      }))
                    }
                  />

                  <p>Data final</p>

                  <input
                    type="date"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={
                      newAlert.endDate
                        ? newAlert.endDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewAlert((prev) => ({
                        ...prev,
                        endDate: new Date(e.target.value),
                      }))
                    }
                  />

                  <Button
                    className="mt-3"
                    size="sm"
                    onClick={handleCreateAlert}
                    disabled={
                      !newAlert.categoryId ||
                      !newAlert.expectedAmount ||
                      !newAlert.dueDate
                    }
                  >
                    Criar
                  </Button>
                </div>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <select
            value={month}
            onChange={(e) => {
              setPage(1);
              setMonth(Number(e.target.value));
            }}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2024, m - 1).toLocaleString("pt-BR", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => {
              setPage(1);
              setYear(Number(e.target.value));
            }}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - 2 + i,
            ).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {alerts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum alerta para esse mês.
        </p>
      )}

      {alerts.length > 0 && (
        <div className="mt-3">
          <ul className="mt-1 flex flex-col">
            {alerts.map((alert) => {
              const daysLeft = Math.ceil((new Date(alert.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              let dotColor = "bg-emerald-500"; // Verde: distante (> 5 dias)
              if (daysLeft <= 2) {
                dotColor = "bg-red-500"; // Vermelho: na data de vencimento ou atrasado
              } else if (daysLeft >= 3 && daysLeft <= 5) {
                dotColor = "bg-amber-500"; // Amarelo: próximo ao vencimento (3-5 dias)
              } else {
                dotColor = "bg-emerald-500"; // Verde: ainda distante (> 5 dias)
              }

              return (
                <li key={alert.id} className="flex items-center justify-between gap-3 py-2 border-b">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <div>
                      <p className="text-sm font-medium">{alert.categoryName}</p>
                      <p className="text-xs text-muted-foreground">{formatDateBR(alert.dueDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold tabular-nums">{alert.expectedAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>

                    {!alert.isPaid && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handlePayAlert(alert.id)}
                        title="Marcar como pago"
                      >
                        <Check size={16} />
                      </Button>
                    )}

                    <Popover open={openId === alert.id} onOpenChange={(o) => setOpenId(o ? alert.id : null)}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-56">
                        <PopoverHeader>
                          <p className="text-sm mb-3">
                            Deseja realmente excluir o alerta de {alert.expectedAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} para {alert.categoryName}?
                          </p>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setOpenId(null)}>
                              Cancelar
                            </Button>

                            <Button size="sm" variant="destructive" onClick={() => { handleDeleteAlert(alert.id); setOpenId(null); }}>
                              Excluir
                            </Button>
                          </div>
                        </PopoverHeader>
                      </PopoverContent>
                    </Popover>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between items-center mt-3">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm text-muted-foreground">Página {pagination?.page ?? page} de {pagination?.totalPages ?? "?"}</span>
            <Button variant="outline" size="sm" disabled={pagination ? (pagination.page >= pagination.totalPages) : (alerts.length < pageSize)} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}
    </div>
  );
}