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

                <p>Categoria da compra</p>
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={createCardPurchase.categoryId}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      categoryId: e.target.value
                    }))
                  }
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

                <p>Data da compra</p>
                <input
                  type="date"
                  className="border rounded-md px-3 py-2 text-sm"
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
                />

                <p>Valor</p>
                <input
                  className="border rounded-md px-3 py-2 text-sm"
                  value={createCardPurchase.totalAmount}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      totalAmount: Number(e.target.value)
                    }))
                  }
                />

                <p>Parcelas</p>
                <input
                  className="border rounded-md px-3 py-2 text-sm"
                  value={createCardPurchase.installments}
                  onChange={(e) =>
                    setCreateCardPurchase((prev) => ({
                      ...prev,
                      installments: Number(e.target.value)
                    }))
                  }
                />

                <p>Descrição da compra</p>
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
                  disabled={
                    !createCardPurchase.categoryId ||
                    !createCardPurchase.installments ||
                    !createCardPurchase.purchaseDate ||
                    !createCardPurchase.totalAmount
                  }
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