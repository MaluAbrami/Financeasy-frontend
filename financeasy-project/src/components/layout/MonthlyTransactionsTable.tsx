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
import { Check, AlertTriangle, Trash2, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

import { transactionService } from "@/services/TransactionService";

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
  const [mobileConfirmId, setMobileConfirmId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

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
    <div className="w-full flex flex-col gap-6">
      {/* ====== SEÇÃO DE LANÇAMENTO ====== */}
      <div className="bg-gradient-to-br from-card via-card to-background border border-border/50 rounded-2xl p-4 md:p-6 w-full">
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">Lançamento rápido</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Registre transações que afetam diretamente o saldo das suas contas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={addRow}
                disabled={!canAdd}
                title="Adicionar linha rápida"
                className="shrink-0"
              >
                + Linha
              </Button>

              <Button 
                type="button" 
                onClick={handleSubmit} 
                disabled={!canAdd} 
                title="Salvar lançamentos"
                className="shrink-0"
              >
                Salvar
              </Button>
            </div>
          </div>

          {!canAdd && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-600">
                Para lançar transações, você precisa ter pelo menos <b>1 conta</b> e <b>1 categoria</b>.
              </p>
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}

          {/* Tabela Desktop / Cards Mobile */}
          {canAdd && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-border/50">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="min-w-44">Conta</TableHead>
                      <TableHead className="min-w-44">Categoria</TableHead>
                      <TableHead className="min-w-40">Método</TableHead>
                      <TableHead className="min-w-32 text-right">Valor</TableHead>
                      <TableHead className="min-w-36 text-right">Data</TableHead>
                      <TableHead className="min-w-48">Descrição</TableHead>
                      <TableHead className="w-12 text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row, idx) => {
                      const isRowOk = payloadPreview[idx]?.ok;

                      return (
                        <TableRow key={row.id} className={!isRowOk ? "opacity-75 bg-muted/20" : ""}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isRowOk ? (
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <Select
                                  value={row.bankAccountId}
                                  onValueChange={(v) =>
                                    updateRow(row.id, { bankAccountId: v })
                                  }
                                >
                                  <SelectTrigger className="h-9">
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
                              <SelectTrigger className="h-9">
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
                              <SelectTrigger className="h-9">
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
                              className="text-right h-9"
                            />
                          </TableCell>

                          <TableCell className="text-right">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full justify-between h-9"
                                >
                                  <span className="truncate text-xs">
                                    {row.date ? formatDateBR(row.date) : "Selecione"}
                                  </span>
                                  <CalendarIcon size={14} className="flex-shrink-0 ml-2" />
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
                              className="h-9 text-sm"
                            />
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
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
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col gap-3">
                {rows.map((row, idx) => {
                  const isRowOk = payloadPreview[idx]?.ok;
                  const isExpanded = expandedRowId === row.id;

                  return (
                    <div
                      key={row.id}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        isRowOk
                          ? "border-border bg-card"
                          : "border-amber-500/30 bg-amber-500/5"
                      }`}
                    >
                      {/* Card Header */}
                      <button
                        onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                        className="w-full p-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isRowOk ? (
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0 text-left">
                            <p className="font-semibold text-sm truncate">
                              {bankAccounts.find((a) => a.id === row.bankAccountId)?.bank ||
                                "Conta"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {categories.find((c) => c.id === row.categoryId)?.name ||
                                "Categoria"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={20}
                          className={`flex-shrink-0 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Card Content */}
                      {isExpanded && (
                        <div className="p-4 space-y-3 border-t border-border/50">
                          <div>
                            <label className="text-xs font-semibold block mb-2">
                              Conta
                            </label>
                            <Select
                              value={row.bankAccountId}
                              onValueChange={(v) =>
                                updateRow(row.id, { bankAccountId: v })
                              }
                            >
                              <SelectTrigger className="h-9">
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

                          <div>
                            <label className="text-xs font-semibold block mb-2">
                              Categoria
                            </label>
                            <Select
                              value={row.categoryId}
                              onValueChange={(v) =>
                                updateRow(row.id, { categoryId: v })
                              }
                            >
                              <SelectTrigger className="h-9">
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
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold block mb-2">
                                Método
                              </label>
                              <Select
                                value={row.paymentMethod}
                                onValueChange={(v) =>
                                  updateRow(row.id, {
                                    paymentMethod: v as PaymentMethod,
                                  })
                                }
                              >
                                <SelectTrigger className="h-9">
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
                            </div>

                            <div>
                              <label className="text-xs font-semibold block mb-2">
                                Valor
                              </label>
                              <Input
                                inputMode="decimal"
                                placeholder="0,00"
                                value={row.amount}
                                onChange={(e) =>
                                  updateRow(row.id, { amount: e.target.value })
                                }
                                className="text-right h-9"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold block mb-2">
                              Data
                            </label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full justify-between h-9"
                                >
                                  <span className="text-sm">
                                    {row.date
                                      ? formatDateBR(row.date)
                                      : "Selecione"}
                                  </span>
                                  <CalendarIcon size={16} />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={row.date}
                                  onSelect={(d) =>
                                    updateRow(row.id, {
                                      date: d ?? undefined,
                                    })
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <label className="text-xs font-semibold block mb-2">
                              Descrição (opcional)
                            </label>
                            <Input
                              placeholder="Digite uma descrição"
                              value={row.description}
                              onChange={(e) =>
                                updateRow(row.id, {
                                  description: e.target.value,
                                })
                              }
                              className="h-9 text-sm"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeRow(row.id)}
                            disabled={rows.length <= 1}
                            className="w-full"
                          >
                            Remover
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground px-3">
                ℹ️ Linhas incompletas são ignoradas ao salvar. Preencha Conta, Categoria, Método, Valor e Data.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ====== HISTÓRICO ====== */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6 w-full">
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">Histórico de transações</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Últimas transações registradas no sistema
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadTransactions(Math.max(1, page - 1))}
                disabled={loadingTx || page <= 1}
              >
                ← Anterior
              </Button>

              <span className="text-xs md:text-sm text-muted-foreground px-2 py-1 bg-muted/50 rounded">
                {page} / {totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadTransactions(Math.min(totalPages, page + 1))}
                disabled={loadingTx || page >= totalPages}
              >
                Próxima →
              </Button>
            </div>
          </div>

          {/* Loading/Error/Empty States */}
          {loadingTx && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Carregando transações...</p>
            </div>
          )}

          {errorTx && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{errorTx}</p>
            </div>
          )}

          {!loadingTx &&
            !errorTx &&
            (transactionsData?.transactions?.length ?? 0) === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma transação encontrada neste período.
                </p>
              </div>
            )}

          {!loadingTx &&
            !errorTx &&
            (transactionsData?.transactions?.length ?? 0) > 0 && (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto rounded-lg border border-border/50">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="min-w-40">Conta</TableHead>
                        <TableHead className="min-w-40">Categoria</TableHead>
                        <TableHead className="min-w-36">Método</TableHead>
                        <TableHead className="min-w-32 text-right">Valor</TableHead>
                        <TableHead className="min-w-36 text-right">Data</TableHead>
                        <TableHead className="min-w-48">Descrição</TableHead>
                        <TableHead className="w-12 text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {transactionsData!.transactions.map((t: TransactionResponse) => (
                        <TableRow key={t.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium text-foreground">
                            {t.bankAccountName}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {t.categoryName}
                          </TableCell>
                          <TableCell className="text-foreground text-sm">
                            {String(t.paymentMethod)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            {t.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell className="text-right text-foreground text-sm">
                            {formatDateBRFromISO(t.date)}
                          </TableCell>
                          <TableCell className="text-foreground text-sm max-w-48 truncate">
                            {t.description || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Popover
                              open={openId === t.id}
                              onOpenChange={(o) => setOpenId(o ? t.id : null)}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  aria-label={`Excluir transação`}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-56">
                                <PopoverHeader>
                                  <p className="text-sm mb-3 font-semibold">
                                    Confirmar exclusão
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-4">
                                    Excluir transação de{" "}
                                    <span className="font-semibold">
                                      {t.amount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </span>
                                    ?
                                  </p>

                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setOpenId(null)}
                                    >
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
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-3">
                  {transactionsData!.transactions.map((t: TransactionResponse) => (
                    <div
                      key={t.id}
                      className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {t.bankAccountName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.categoryName}
                          </p>
                        </div>
                        <p className="font-bold text-lg text-foreground">
                          {t.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{String(t.paymentMethod)}</span>
                        <span>{formatDateBRFromISO(t.date)}</span>
                      </div>

                      {t.description && (
                        <p className="text-sm text-foreground bg-muted/30 p-2 rounded mt-2">
                          {t.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-border/50 flex justify-end">
                        {mobileConfirmId === t.id ? (
                          <div className="flex justify-end gap-2 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMobileConfirmId(null)}
                            >
                              Cancelar
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                handleDeleteTransaction(t.id);
                                setMobileConfirmId(null);
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => setMobileConfirmId(t.id)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
