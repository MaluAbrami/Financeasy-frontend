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
import { Check, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Trash2 } from "lucide-react";

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

  const [openId, setOpenId] = useState<string | null>(null);

  async function loadPurchases(targetPage: number) {
    try {
      setLoading(true);
      setError(null);

      const pagination: PaginationRequest = {
        page: targetPage,
        pageSize: 10,
        orderBy: "PurchaseDate", // se no back for outro nome, troque aqui
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
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 w-full">
      {/* Header igual ao padrão */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground">Compras no cartão</h3>
          <p className="text-sm text-muted-foreground">
            Use o lançamento rápido acima para registrar compras parceladas no cartão.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={addRow} disabled={!canAdd} title="Adicionar linha rápida">
            + Linha rápida
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={!canAdd} title="Salvar compras">
            Salvar compras
          </Button>
        </div>
      </div>

      {!canAdd && (
        <p className="mt-4 text-sm text-muted-foreground">
          Para lançar compras, você precisa ter pelo menos <b>1 cartão</b> e{" "}
          <b>1 categoria</b>.
        </p>
      )}

      {submitError && (
        <p className="mt-4 text-sm text-destructive">{submitError}</p>
      )}

      {/* Draft table no mesmo padrão: min-width + alinhamentos */}
      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-47.5">Cartão</TableHead>
              <TableHead className="min-w-45">Categoria</TableHead>
              <TableHead className="min-w-35 text-right">Valor</TableHead>
              <TableHead className="min-w-30 text-right">Parcelas</TableHead>
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
                          value={row.cardId}
                          onValueChange={(v) => updateRow(row.id, { cardId: v })}
                        >
                          <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                      className="text-right"
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
                            {row.purchaseDate
                              ? formatDateBR(row.purchaseDate)
                              : "Selecione"}
                          </span>
                          <span className="text-muted-foreground">📅</span>
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={row.purchaseDate}
                          onSelect={(d) =>
                            updateRow(row.id, { purchaseDate: d ?? undefined })
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
                      aria-label="Remover linha"
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
          Dica: linhas incompletas são ignoradas ao salvar. Preencha Cartão,
          Categoria, Valor, Parcelas e Data.
        </p>
      </div>

      {/* Histórico igualzinho ao padrão das transações */}
      <div className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h4 className="text-base font-semibold text-foreground">Histórico</h4>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => loadPurchases(Math.max(1, page - 1))}
              disabled={loading || page <= 1}
            >
              Anterior
            </Button>

            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={() => loadPurchases(Math.min(totalPages, page + 1))}
              disabled={loading || page >= totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        )}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {!loading && !error && (historyRows?.length ?? 0) === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhuma compra encontrada.
          </p>
        )}

        {!loading && !error && (historyRows?.length ?? 0) > 0 && (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-45">Cartão</TableHead>
                  <TableHead className="min-w-40">Categoria</TableHead>
                  <TableHead className="min-w-35 text-right">
                    Valor
                  </TableHead>
                  <TableHead className="min-w-30 text-right">
                    Parcelas
                  </TableHead>
                  <TableHead className="min-w-35 text-right">
                    Data
                  </TableHead>
                  <TableHead className="min-w-60">Descrição</TableHead>
                  <TableHead className="w-15 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {historyRows.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-foreground">
                      {p.cardName ?? p.card?.name ?? "-"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {p.categoryName ?? p.category?.name ?? "-"}
                    </TableCell>
                    <TableCell className="text-right text-foreground font-semibold">
                      {Number(p.totalAmount ?? 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {p.installments ?? "-"}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {formatDateBRFromISO(p.purchaseDate)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {p.description ?? ""}
                    </TableCell>
                    <TableCell>
                      <Popover open={openId === p.id} onOpenChange={(o) => setOpenId(o ? p.id : null)}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-56">
                          <PopoverHeader>
                            <p className="text-sm mb-3">
                              Deseja realmente excluir a compra de{" "}
                              {p.totalAmount.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                              ?
                            </p>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setOpenId(null)}>
                                Cancelar
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    handleDeletePurchase(p.id) 
                                    setOpenId(null)
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
        )}
      </div>
    </div>
  );
}
