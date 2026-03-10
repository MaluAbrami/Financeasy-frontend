import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { cardPurchaseService } from "@/services/CardPurchaseService";

import type { CardPurchaseResponse } from "@/models/card/CardPurchaseResponse";

interface CardPurchasesProps {
  cardId: string;
}

export function CardPurchases({ cardId }: CardPurchasesProps) {

  const [purchases, setPurchases] = useState<CardPurchaseResponse[]>([]);

  async function loadPurchases() {
    const data = await cardPurchaseService.getAllByCard(cardId, {
        page: 1,
        pageSize: 10,
        orderBy: "",
        direction: "Asc"
    });
    setPurchases(data.purchases ?? []);
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

        <Button size="sm">
          Nova compra
        </Button>

      </div>

      <div className="flex flex-col gap-2">

        {purchases.map((purchase) => (

          <div
            key={purchase.id}
            className="flex justify-between items-center border rounded-lg p-3"
          >

            <div>

              <p className="font-medium">
                {purchase.description}
              </p>

              <p className="text-xs text-muted-foreground">
                {purchase.installments}x parcelas
              </p>

            </div>

            <p className="font-semibold">
              {purchase.totalAmount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}