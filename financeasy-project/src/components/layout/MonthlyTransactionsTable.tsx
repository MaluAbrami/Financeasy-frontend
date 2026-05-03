import type { BankAccountResponse } from "@/models/bankAccount/BankAccountResponse";
import type { CreateTransactionRequest } from "@/models/transaction/CreateTransactionRequest";
import type { TransactionDraft } from "@/models/transaction/TransactionDraft";
import type { PaymentMethod } from "@/models/transaction/PaymentMethod";
import type { CategoryResponse } from "@/models/category/CategoryResponse";
import type { TransactionResponse } from "@/models/transaction/TransactionResponse";
import type { PaginationRequest } from "@/models/pagination/PaginationRequest";
import type { GetAllTransactions } from "@/models/transaction/GetAllTransactions";

import { useMemo, useState, useEffect } from "react";

import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Check, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

import { transactionService } from "@/services/TransactionService";
import { Trash2 } from "lucide-react";

type Props = {
  bankAccounts: BankAccountResponse[];
  categories: CategoryResponse[];
  onSubmit: (payload: CreateTransactionRequest[]) => Promise<void> | void;
  refreshDashboard: () => void;
};

function parseBRL(input: string): number {
  const normalized = input.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

function formatDateBRFromISO(dateIso: string) {
  const d = new Date(dateIso);
  return Number.isNaN(d.getTime()) ? dateIso : new Intl.DateTimeFormat("pt-BR").format(d);
}

function formatDateBR(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function newDraftRow(): TransactionDraft {
  return {
    id: crypto.randomUUID(),
    bankAccountId: "",
    categoryId: "",
    paymentMethod: "Pix" as PaymentMethod,
    amount: "",
    date: new Date(),
    description: "",
  };
}

export function MonthlyTransactionsTable({ bankAccounts, categories, onSubmit, refreshDashboard }: Props) {
  const [rows, setRows] = useState<TransactionDraft[]>(() => [newDraftRow()]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: "Pix", label: "Pix" },
    { value: "DebtCard" as PaymentMethod, label: "Cartão de Débito" },
    { value: "Transfer" as PaymentMethod, label: "Transferência" },
    { value: "Cash" as PaymentMethod, label: "Dinheiro" },
  ];

  const canAdd = bankAccounts.length > 0 && categories.length > 0;

  function updateRow(id: string, patch: Partial<TransactionDraft>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, newDraftRow()]);
  }
  function removeRow(id: string) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  const payloadPreview = useMemo(() => {
    return rows.map((r) => {
      const amount = parseBRL(r.amount);
      return {
        ok:
          !!r.bankAccountId &&
          !!r.categoryId &&
          !!r.paymentMethod &&
          !!r.date &&
          r.amount.trim().length > 0 &&
          Number.isFinite(amount) &&
          amount > 0,
      };
    });
  }, [rows]);

  async function handleSubmit() {
    setSubmitError(null);

    const payload: CreateTransactionRequest[] = [];

    for (const r of rows) {
      const amount = parseBRL(r.amount);

      const isValid =
        !!r.bankAccountId &&
        !!r.categoryId &&
        !!r.paymentMethod &&
        !!r.date &&
        r.amount.trim().length > 0 &&
        Number.isFinite(amount) &&
        amount > 0;

      if (!isValid) continue;

      payload.push({
        bankAccountId: r.bankAccountId,
        categoryId: r.categoryId,
        paymentMethod: r.paymentMethod,
        amount,
        date: r.date,
        description: r.description?.trim() || "",
      });
    }

    if (payload.length === 0) {
      setSubmitError("Preencha pelo menos 1 linha válida antes de salvar.");
      return;
    }

    await onSubmit(payload);

    // ✅ depois de salvar: limpa drafts e recarrega a lista do backend
    setRows([newDraftRow()]);
    await loadTransactions(1);
  }

  // ====== Listagem (backend) ======
  const [transactionsData, setTransactionsData] = useState<GetAllTransactions | null>(null);
  const [loadingTx, setLoadingTx] = useState(false);
  const [errorTx, setErrorTx] = useState<string | null>(null);

  // paginação local (ajuste pageSize como quiser)
  const page = transactionsData?.pagination?.page ?? 1;
  const totalPages = transactionsData?.pagination?.totalPages ?? 1;

  async function loadTransactions(targetPage: number) {
    try {
      setLoadingTx(true);
      setErrorTx(null);

      const pagination: PaginationRequest = {
        page: targetPage,
        pageSize: 10,
        orderBy: "Date",
        direction: "Desc",
      };

      const response = await transactionService.getAll(pagination);
      setTransactionsData(response);
    } catch (e) {
      setErrorTx("Não foi possível carregar as transações.");
    } finally {
      setLoadingTx(false);
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      await transactionService.delete(id);
      await loadTransactions(1);
      await refreshDashboard();
    } catch (error) {
      console.error("Erro ao deletar transação", error);
    }
  }

  useEffect(() => {
    loadTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 w-full">
      {/* ====== Header ====== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground">Transações do mês</h3>
          <p className="text-sm text-muted-foreground">
            Use o lançamento rápido acima para registrar transações (impactam o saldo). As compras no cartão ficam em outra aba.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={addRow}
            disabled={!canAdd}
            title="Adicionar linha rápida"
          >
            + Linha rápida
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={!canAdd} title="Salvar lançamentos">
            Salvar lançamentos
          </Button>
        </div>
      </div>

      {!canAdd && (
        <p className="mt-4 text-sm text-muted-foreground">
          Para lançar transações, você precisa ter pelo menos <b>1 conta</b> e{" "}
          <b>1 categoria</b>.
        </p>
      )}

      {submitError && (
        <p className="mt-4 text-sm text-destructive">{submitError}</p>
      )}

      {/* ====== Tabela de lançamento (draft) ====== */}
      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-47.5">Conta</TableHead>
              <TableHead className="min-w-45">Categoria</TableHead>
              <TableHead className="min-w-40">Método</TableHead>
              <TableHead className="min-w-35 text-right">Valor</TableHead>
              <TableHead className="min-w-37.5 text-right">Data</TableHead>
              <TableHead className="min-w-60">Descrição</TableHead>
              <TableHead className="w-15 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, idx) => {
              const isRowOk = payloadPreview[idx]?.ok;

              return (
                <TableRow key={row.id} className={!isRowOk ? "opacity-95" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isRowOk ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <div className="min-w-0">
                        <Select
                          value={row.bankAccountId}
                          onValueChange={(v) =>
                            updateRow(row.id, { bankAccountId: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={row.categoryId}
                      onValueChange={(v) =>
                        updateRow(row.id, { categoryId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={row.paymentMethod}
                      onValueChange={(v) =>
                        updateRow(row.id, { paymentMethod: v as PaymentMethod })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((m) => (
                          <SelectItem
                            key={String(m.value)}
                            value={String(m.value)}
                          >
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-right">
                    <Input
                      inputMode="decimal"
                      placeholder="0,00"
                      value={row.amount}
                      onChange={(e) =>
                        updateRow(row.id, { amount: e.target.value })
                      }
                      className="text-right"
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span className="truncate">
                            {row.date ? formatDateBR(row.date) : "Selecione"}
                          </span>
                          <span className="text-muted-foreground">📅</span>
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={row.date}
                          onSelect={(d) =>
                            updateRow(row.id, { date: d ?? undefined })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  <TableCell>
                    <Input
                      placeholder="Opcional"
                      value={row.description}
                      onChange={(e) =>
                        updateRow(row.id, { description: e.target.value })
                      }
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                    >
                      ✕
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <p className="mt-3 text-xs text-muted-foreground">
          Dica: linhas incompletas são ignoradas ao salvar. Preencha Conta,
          Categoria, Método, Valor e Data.
        </p>
      </div>

      {/* ====== Listagem do backend (read-only) ====== */}
      <div className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h4 className="text-base font-semibold text-foreground">Histórico</h4>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => loadTransactions(Math.max(1, page - 1))}
              disabled={loadingTx || page <= 1}
            >
              Anterior
            </Button>

            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={() => loadTransactions(Math.min(totalPages, page + 1))}
              disabled={loadingTx || page >= totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>

        {loadingTx && (
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        )}
        {errorTx && <p className="mt-4 text-sm text-destructive">{errorTx}</p>}

        {!loadingTx &&
          !errorTx &&
          (transactionsData?.transactions?.length ?? 0) === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhuma transação encontrada.
            </p>
          )}

        {!loadingTx &&
          !errorTx &&
          (transactionsData?.transactions?.length ?? 0) > 0 && (
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40">Conta</TableHead>
                    <TableHead className="min-w-40">Categoria</TableHead>
                    <TableHead className="min-w-35">Método</TableHead>
                    <TableHead className="min-w-35 text-right">Valor</TableHead>
                    <TableHead className="min-w-35 text-right">Data</TableHead>
                    <TableHead className="min-w-60">Descrição</TableHead>
                    <TableHead className="w-15 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactionsData!.transactions.map(
                    (t: TransactionResponse) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-foreground">
                          {t.bankAccountName}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {t.categoryName}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {String(t.paymentMethod)}
                        </TableCell>
                        <TableCell className="text-right text-foreground font-semibold">
                          {t.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell className="text-right text-foreground">
                          {formatDateBRFromISO(t.date)}
                        </TableCell>
                        <TableCell className="text-foreground">{t.description}</TableCell>
                        <TableCell className="text-right">
                          <Popover open={openId === t.id} onOpenChange={(o) => setOpenId(o ? t.id : null)}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                aria-label={`Excluir transação ${t.id}`}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-56">
                              <PopoverHeader>
                                <p className="text-sm mb-3">
                                  Deseja realmente excluir a transação de {t.amount.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}?
                                </p>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setOpenId(null)}>
                                    Cancelar
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      handleDeleteTransaction(t.id);
                                      setOpenId(null);
                                    }}
                                  >
                                    Excluir
                                  </Button>
                                </div>
                              </PopoverHeader>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          )}
      </div>
    </div>
  );
}
