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
import { Trash2, Check, X } from "lucide-react";

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
  const [showCreateModal, setShowCreateModal] = useState(false);

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
  const [alertErrors, setAlertErrors] = useState<Record<string, string>>({});

  function validateCreateAlert() {
    const errors: Record<string, string> = {};

    if (!newAlert.categoryId) errors.categoryId = "Selecione uma categoria";
    if (!newAlert.expectedAmount || newAlert.expectedAmount <= 0) errors.expectedAmount = "Valor deve ser maior que zero";
    if (!newAlert.dueDate) errors.dueDate = "Data de vencimento é obrigatória";

    setAlertErrors(errors);
    return errors;
  }

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
    const errors = validateCreateAlert();
    if (Object.keys(errors).length > 0) return;

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
      setAlertErrors({});
      setShowCreateModal(false);
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
    <div className="bg-card border border-border p-4 md:p-6 rounded-2xl w-full">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Lembretes - pendências pessoais e recorrentes</h2>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="shrink-0" onClick={() => setShowCreateModal(true)}>+ Alerta</Button>
          <select
            value={month}
            onChange={(e) => {
              setPage(1);
              setMonth(Number(e.target.value));
            }}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm min-w-38"
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
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm min-w-26"
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
                <li key={alert.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{alert.categoryName}</p>
                      <p className="text-xs text-muted-foreground">{formatDateBR(alert.dueDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-3 w-full sm:w-auto">
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

          <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm text-muted-foreground">Página {pagination?.page ?? page} de {pagination?.totalPages ?? "?"}</span>
            <Button variant="outline" size="sm" disabled={pagination ? (pagination.page >= pagination.totalPages) : (alerts.length < pageSize)} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}

      {/* Modal de criação de alerta */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-5 md:p-6 shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Criar novo alerta</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} aria-label="Fechar">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1">Categoria</label>
                <select
                  className={`w-full border rounded-md px-3 py-2 text-sm bg-card ${alertErrors.categoryId ? 'border-destructive' : ''}`}
                  value={newAlert.categoryId}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, categoryId: e.target.value }))}
                  aria-invalid={!!alertErrors.categoryId}
                  aria-describedby={alertErrors.categoryId ? 'err-category' : undefined}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {alertErrors.categoryId && <p id="err-category" className="text-xs text-destructive mt-1">{alertErrors.categoryId}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Tipo de recorrência</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-card"
                  value={newAlert.recurrenceType}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, recurrenceType: e.target.value }))}
                >
                  {recurrenceOptions.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Valor esperado</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  inputMode="decimal"
                  className={`w-full border rounded-md px-3 py-2 text-sm ${alertErrors.expectedAmount ? 'border-destructive' : ''}`}
                  value={newAlert.expectedAmount}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, expectedAmount: Number(e.target.value) }))}
                  aria-invalid={!!alertErrors.expectedAmount}
                  aria-describedby={alertErrors.expectedAmount ? 'err-amount' : undefined}
                />
                {alertErrors.expectedAmount && <p id="err-amount" className="text-xs text-destructive mt-1">{alertErrors.expectedAmount}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Data de vencimento</label>
                <input
                  type="date"
                  className={`w-full border rounded-md px-3 py-2 text-sm ${alertErrors.dueDate ? 'border-destructive' : ''}`}
                  value={newAlert.dueDate.toISOString().split("T")[0]}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, dueDate: new Date(e.target.value) }))}
                  aria-invalid={!!alertErrors.dueDate}
                  aria-describedby={alertErrors.dueDate ? 'err-date' : undefined}
                />
                {alertErrors.dueDate && <p id="err-date" className="text-xs text-destructive mt-1">{alertErrors.dueDate}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Data inicial (opcional)</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={newAlert.startDate ? newAlert.startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, startDate: new Date(e.target.value) }))}
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Data final (opcional)</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={newAlert.endDate ? newAlert.endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, endDate: new Date(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleCreateAlert}
                disabled={Object.keys(alertErrors).length > 0}
              >
                Criar alerta
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}