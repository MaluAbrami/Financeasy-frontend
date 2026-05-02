import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { cardPurchaseService } from "@/services/CardPurchaseService";

import type { CardPurchaseResponse } from "@/models/card/CardPurchaseResponse";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "../ui/popover";

import type { CreateCardPurchase } from "@/models/card/CreateCardPurchase";
import type { CategoryResponse } from "@/models/category/CategoryResponse";

import { Trash2 } from "lucide-react";

interface CardPurchasesProps {
  cardId: string;
  categories: CategoryResponse[] | null;
  onPurchaseChanged: () => void;
}

export function CardPurchases({ cardId, categories, onPurchaseChanged }: CardPurchasesProps) {
  const [openPurchaseId, setOpenPurchaseId] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<CardPurchaseResponse[] | null>([]);

  const [createCardPurchase, setCreateCardPurchase] = useState<Omit<CreateCardPurchase, "cardId">>({
    categoryId: "",
    totalAmount: 0,
    installments: 0,
    purchaseDate: new Date(),
    description: ""
  });

  async function handleCreatePurchase() {
    try {

      await cardPurchaseService.create({
        ...createCardPurchase,
        cardId
      });

      await loadPurchases();
      onPurchaseChanged();

      setCreateCardPurchase({
        categoryId: "",
        totalAmount: 0,
        installments: 0,
        purchaseDate: new Date(),
        description: ""
      });
    } catch (error) {
      console.error("Erro ao criar compra nova no cartão", error);
    }
  }

  async function handleDeletePurchase(id: string) {
    try {
      await cardPurchaseService.delete(id);
      await loadPurchases();
      onPurchaseChanged();
    } catch (error) {
      console.error("Erro ao deletar compra", error);
    }
  }

  async function loadPurchases() {

    const data = await cardPurchaseService.getAllByCard(cardId, {
      page: 1,
      pageSize: 10,
      orderBy: "PurchaseDate",
      direction: "Desc"
    });

    setPurchases(data.cardPurchases);
  }

  useEffect(() => {
    loadPurchases();
  }, [cardId]);

  function validateCreatePurchase() {
    const errors: Record<string, string> = {};

    if (!createCardPurchase.categoryId) errors.categoryId = "Selecione uma categoria";
    if (!createCardPurchase.purchaseDate) errors.purchaseDate = "Data é obrigatória";
    if (createCardPurchase.totalAmount <= 0) errors.totalAmount = "Valor deve ser maior que zero";
    if (createCardPurchase.installments <= 0) errors.installments = "Parcelas devem ser maior que zero";

    return errors;
  }

  const purchaseErrors = validateCreatePurchase();

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold">
          Compras do cartão
        </h2>

        <Popover>

          <PopoverTrigger asChild>
            <Button size="sm">
              Nova compra
            </Button>
          </PopoverTrigger>

          <PopoverContent>

            <PopoverHeader>

              <PopoverTitle className="text-lg">
                Nova compra
              </PopoverTitle>

              <div className="flex flex-col gap-3 mt-3">

                <label className="font-semibold">Categoria da compra</label>
                <select
                  className={`border rounded-md px-3 py-2 text-sm ${purchaseErrors.categoryId ? 'border-destructive' : ''}`}
                  value={createCardPurchase.categoryId}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      categoryId: e.target.value
                    }))
                  }
                  aria-invalid={!!purchaseErrors.categoryId}
                  aria-describedby={purchaseErrors.categoryId ? 'err-category' : undefined}
                >
                  <option value="" className="bg-card">
                    Selecione uma categoria
                  </option>

                  {categories?.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-card"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {purchaseErrors.categoryId && <p id="err-category" className="text-xs text-destructive mt-1">{purchaseErrors.categoryId}</p>}

                <label className="font-semibold">Data da compra</label>
                <input
                  type="date"
                  className={`border rounded-md px-3 py-2 text-sm ${purchaseErrors.purchaseDate ? 'border-destructive' : ''}`}
                  value={
                    createCardPurchase.purchaseDate instanceof Date
                      ? createCardPurchase.purchaseDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      purchaseDate: new Date(e.target.value)
                    }))
                  }
                  aria-invalid={!!purchaseErrors.purchaseDate}
                  aria-describedby={purchaseErrors.purchaseDate ? 'err-date' : undefined}
                />
                {purchaseErrors.purchaseDate && <p id="err-date" className="text-xs text-destructive mt-1">{purchaseErrors.purchaseDate}</p>}

                <label className="font-semibold">Valor</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  inputMode="decimal"
                  className={`border rounded-md px-3 py-2 text-sm ${purchaseErrors.totalAmount ? 'border-destructive' : ''}`}
                  value={createCardPurchase.totalAmount}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      totalAmount: Number(e.target.value)
                    }))
                  }
                  aria-invalid={!!purchaseErrors.totalAmount}
                  aria-describedby={purchaseErrors.totalAmount ? 'err-amount' : undefined}
                />
                {purchaseErrors.totalAmount && <p id="err-amount" className="text-xs text-destructive mt-1">{purchaseErrors.totalAmount}</p>}

                <label className="font-semibold">Parcelas</label>
                <input
                  type="number"
                  min={1}
                  className={`border rounded-md px-3 py-2 text-sm ${purchaseErrors.installments ? 'border-destructive' : ''}`}
                  value={createCardPurchase.installments}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      installments: Number(e.target.value)
                    }))
                  }
                  aria-invalid={!!purchaseErrors.installments}
                  aria-describedby={purchaseErrors.installments ? 'err-installments' : undefined}
                />
                {purchaseErrors.installments && <p id="err-installments" className="text-xs text-destructive mt-1">{purchaseErrors.installments}</p>}

                <label>Descrição da compra</label>
                <input
                  className="border rounded-md px-3 py-2 text-sm"
                  value={createCardPurchase.description}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                />

                <Button
                  className="mt-4"
                  size="sm"
                  onClick={handleCreatePurchase}
                  disabled={Object.keys(purchaseErrors).length > 0}
                >
                  Lançar compra
                </Button>

              </div>

            </PopoverHeader>

          </PopoverContent>

        </Popover>

      </div>

      <div className="flex flex-col gap-2">

        {purchases?.map((purchase) => (

          <div
            key={purchase.id}
            className="flex justify-between items-center border rounded-lg p-3 hover:bg-muted/40 transition-colors"
          >

            <div>

              <p className="font-medium">
                {new Date(purchase.purchaseDate).toLocaleDateString("pt-BR")}
              </p>

              <p className="font-medium">
                {purchase.description}
              </p>

              <p className="text-xs text-muted-foreground">
                {purchase.installments}x parcelas
              </p>

            </div>

            <div className="flex items-center gap-3">

              <p className="font-semibold">
                {purchase.totalAmount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>

              <Popover
                open={openPurchaseId === purchase.id}
                onOpenChange={(nextOpen) => setOpenPurchaseId(nextOpen ? purchase.id : null)}
              >

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
                      {purchase.totalAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}?
                    </p>

                    <div className="flex justify-end gap-2">

                      <Button variant="outline" size="sm" onClick={() => setOpenPurchaseId(null)}>
                        Cancelar
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          handleDeletePurchase(purchase.id)
                          setOpenPurchaseId(null)
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

    </div>
  );
}