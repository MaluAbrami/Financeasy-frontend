import { useEffect, useMemo, useState } from "react";

import type { CardResponse } from "@/models/card/CardResponse";
import type { CategoryResponse } from "@/models/category/CategoryResponse";
import type { CreateCardPurchase } from "@/models/card/CreateCardPurchase";
import type { PaginationRequest } from "@/models/pagination/PaginationRequest";
import type { GetAllCardPurchase } from "@/models/card/GetAllCardPurchases";

import { cardPurchaseService } from "@/services/CardPurchaseService";

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

type Draft = {
  id: string;
  cardId: string;
  categoryId: string;
  totalAmount: string;
  installments: string;
  purchaseDate: Date;
  description: string;
};

type Props = {
  cards: CardResponse[];
  categories: CategoryResponse[];
  onSubmit: (payload: CreateCardPurchase[]) => Promise<void> | void;
};

function newRow(): Draft {
  return {
    id: crypto.randomUUID(),
    cardId: "",
    categoryId: "",
    totalAmount: "",
    installments: "1",
    purchaseDate: new Date(),
    description: "",
  };
}

function parseBRL(input: string): number {
  const normalized = input.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

function formatDateBR(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDateBRFromISO(dateIso: string) {
  const d = new Date(dateIso);
  return Number.isNaN(d.getTime()) ? dateIso : new Intl.DateTimeFormat("pt-BR").format(d);
}

export function MonthlyCardPurchasesTable({ cards, categories, onSubmit }: Props) {
  const [rows, setRows] = useState<Draft[]>(() => [newRow()]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const canAdd = cards.length > 0 && categories.length > 0;

  function updateRow(id: string, patch: Partial<Draft>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, newRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  const payloadPreview = useMemo(() => {
    return rows.map((r) => {
      const amount = parseBRL(r.totalAmount);
      const installments = Number(r.installments);

      return {
        ok:
          !!r.cardId &&
          !!r.categoryId &&
          !!r.purchaseDate &&
          r.totalAmount.trim().length > 0 &&
          Number.isFinite(amount) &&
          amount > 0 &&
          Number.isInteger(installments) &&
          installments >= 1,
      };
    });
  }, [rows]);

  async function handleSubmit() {
    setSubmitError(null);

    const payload: CreateCardPurchase[] = [];

    for (const r of rows) {
      const totalAmount = parseBRL(r.totalAmount);
      const installments = Number(r.installments);

      const isValid =
        !!r.cardId &&
        !!r.categoryId &&
        !!r.purchaseDate &&
        r.totalAmount.trim().length > 0 &&
        Number.isFinite(totalAmount) &&
        totalAmount > 0 &&
        Number.isInteger(installments) &&
        installments >= 1;

      if (!isValid) continue;

      payload.push({
        cardId: r.cardId,
        categoryId: r.categoryId,
        totalAmount,
        installments,
        purchaseDate: r.purchaseDate,
        description: r.description?.trim() || "",
      });
    }

    if (payload.length === 0) {
      setSubmitError("Preencha pelo menos 1 linha válida antes de salvar.");
      return;
    }

    await onSubmit(payload);

    setRows([newRow()]);
    await loadPurchases(1);
  }

  const [purchasesData, setPurchasesData] = useState<GetAllCardPurchase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const page = purchasesData?.pagination?.page ?? 1;
  const totalPages = purchasesData?.pagination?.totalPages ?? 1;

  async function loadPurchases(targetPage: number) {
    try {
      setLoading(true);
      setError(null);

      const pagination: PaginationRequest = {
        page: targetPage,
        pageSize: 10,
        orderBy: "PurchaseDate",
        direction: "Desc",
      };

      const response = await cardPurchaseService.getAll(pagination);
      setPurchasesData(response);
    } catch (e) {
      setError("Não foi possível carregar as compras no cartão.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePurchase(id: string) {
    try {
      await cardPurchaseService.delete(id);
      await loadPurchases(1);
    } catch (error) {
      console.error("Erro ao deletar compra", error);
    }
  }

  useEffect(() => {
    loadPurchases(1);
  }, []);

  const historyRows = purchasesData?.cardPurchases ?? [];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ====== SEÇÃO DE LANÇAMENTO ====== */}
      <div className="bg-gradient-to-br from-card via-card to-background border border-border/50 rounded-2xl p-4 md:p-6 w-full">
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">Compras no cartão</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Registre compras parceladas nos seus cartões de crédito
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
                title="Salvar compras"
                className="shrink-0"
              >
                Salvar
              </Button>
            </div>
          </div>

          {!canAdd && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-600">
                Para lançar compras, você precisa ter pelo menos <b>1 cartão</b> e <b>1 categoria</b>.
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
                      <TableHead className="min-w-40">Cartão</TableHead>
                      <TableHead className="min-w-44">Categoria</TableHead>
                      <TableHead className="min-w-32 text-right">Valor</TableHead>
                      <TableHead className="min-w-28 text-right">Parcelas</TableHead>
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
                                  value={row.cardId}
                                  onValueChange={(v) =>
                                    updateRow(row.id, { cardId: v })
                                  }
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {cards.map((c) => (
                                      <SelectItem key={c.id} value={c.id}>
                                        {c.name}
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

                          <TableCell className="text-right">
                            <Input
                              inputMode="decimal"
                              placeholder="0,00"
                              value={row.totalAmount}
                              onChange={(e) =>
                                updateRow(row.id, { totalAmount: e.target.value })
                              }
                              className="text-right h-9"
                            />
                          </TableCell>

                          <TableCell className="text-right">
                            <Input
                              inputMode="numeric"
                              placeholder="1"
                              value={row.installments}
                              onChange={(e) =>
                                updateRow(row.id, { installments: e.target.value })
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
                                    {row.purchaseDate
                                      ? formatDateBR(row.purchaseDate)
                                      : "Selecione"}
                                  </span>
                                  <CalendarIcon size={14} className="flex-shrink-0 ml-2" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="p-0" align="end">
                                <Calendar
                                  mode="single"
                                  selected={row.purchaseDate}
                                  onSelect={(d) =>
                                    updateRow(row.id, {
                                      purchaseDate: d ?? undefined,
                                    })
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
                              {cards.find((c) => c.id === row.cardId)?.name ||
                                "Cartão"}
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
                              Cartão
                            </label>
                            <Select
                              value={row.cardId}
                              onValueChange={(v) =>
                                updateRow(row.id, { cardId: v })
                              }
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {cards.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name}
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
                                Valor
                              </label>
                              <Input
                                inputMode="decimal"
                                placeholder="0,00"
                                value={row.totalAmount}
                                onChange={(e) =>
                                  updateRow(row.id, { totalAmount: e.target.value })
                                }
                                className="text-right h-9"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold block mb-2">
                                Parcelas
                              </label>
                              <Input
                                inputMode="numeric"
                                placeholder="1"
                                value={row.installments}
                                onChange={(e) =>
                                  updateRow(row.id, { installments: e.target.value })
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
                                    {row.purchaseDate
                                      ? formatDateBR(row.purchaseDate)
                                      : "Selecione"}
                                  </span>
                                  <CalendarIcon size={16} />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={row.purchaseDate}
                                  onSelect={(d) =>
                                    updateRow(row.id, {
                                      purchaseDate: d ?? undefined,
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
                ℹ️ Linhas incompletas são ignoradas ao salvar. Preencha Cartão, Categoria, Valor, Parcelas e Data.
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
              <h3 className="text-lg md:text-xl font-bold text-foreground">Histórico de compras</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Últimas compras registradas nos seus cartões
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadPurchases(Math.max(1, page - 1))}
                disabled={loading || page <= 1}
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
                onClick={() => loadPurchases(Math.min(totalPages, page + 1))}
                disabled={loading || page >= totalPages}
              >
                Próxima →
              </Button>
            </div>
          </div>

          {/* Loading/Error/Empty States */}
          {loading && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Carregando compras...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && (historyRows?.length ?? 0) === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma compra encontrada neste período.
              </p>
            </div>
          )}

          {!loading && !error && (historyRows?.length ?? 0) > 0 && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-border/50">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="min-w-40">Cartão</TableHead>
                      <TableHead className="min-w-40">Categoria</TableHead>
                      <TableHead className="min-w-32 text-right">Valor</TableHead>
                      <TableHead className="min-w-28 text-right">Parcelas</TableHead>
                      <TableHead className="min-w-36 text-right">Data</TableHead>
                      <TableHead className="min-w-48">Descrição</TableHead>
                      <TableHead className="w-12 text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {historyRows.map((p: any) => (
                      <TableRow key={p.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-foreground">
                          {p.cardName ?? p.card?.name ?? "-"}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {p.categoryName ?? p.category?.name ?? "-"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          {Number(p.totalAmount ?? 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell className="text-right text-foreground text-sm">
                          {p.installments ?? "-"}
                        </TableCell>
                        <TableCell className="text-right text-foreground text-sm">
                          {formatDateBRFromISO(p.purchaseDate)}
                        </TableCell>
                        <TableCell className="text-foreground text-sm max-w-48 truncate">
                          {p.description ?? "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Popover
                            open={openId === p.id}
                            onOpenChange={(o) => setOpenId(o ? p.id : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
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
                                  Excluir compra de{" "}
                                  <span className="font-semibold">
                                    {p.totalAmount.toLocaleString("pt-BR", {
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
                                      handleDeletePurchase(p.id);
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
                {historyRows.map((p: any) => (
                  <div
                    key={p.id}
                    className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">
                          {p.cardName ?? p.card?.name ?? "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.categoryName ?? p.category?.name ?? "-"}
                        </p>
                      </div>
                      <p className="font-bold text-lg text-foreground">
                        {Number(p.totalAmount ?? 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{p.installments ?? "-"}x</span>
                      <span>{formatDateBRFromISO(p.purchaseDate)}</span>
                    </div>

                    {p.description && (
                      <p className="text-sm text-foreground bg-muted/30 p-2 rounded mt-2">
                        {p.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-border/50 flex justify-end">
                      <Popover
                        open={openId === p.id}
                        onOpenChange={(o) => setOpenId(o ? p.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Excluir
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-56">
                          <PopoverHeader>
                            <p className="text-sm mb-3 font-semibold">
                              Confirmar exclusão
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              Excluir compra de{" "}
                              <span className="font-semibold">
                                {p.totalAmount.toLocaleString("pt-BR", {
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
                                  handleDeletePurchase(p.id);
                                  setOpenId(null);
                                }}
                              >
                                Excluir
                              </Button>
                            </div>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
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
