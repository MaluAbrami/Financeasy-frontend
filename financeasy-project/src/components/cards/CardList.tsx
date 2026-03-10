import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { cardService } from "@/services/CardService";

import type { CardResponse } from "@/models/card/CardResponse";

interface CardListProps {
  selectedCard: CardResponse | null;
  onSelectCard: (card: CardResponse) => void;
}

export function CardList({ selectedCard, onSelectCard }: CardListProps) {

  const [cards, setCards] = useState<CardResponse[]>([]);

  async function loadCards() {
    const data = await cardService.getAll({page: 1, pageSize: 10, orderBy: "", direction: "Asc"});
    setCards(data.cards ?? []);
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Seus cartões</h2>

        <Button size="sm">
          + Cartão
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto">

        {cards.map((card) => {

          const isSelected = selectedCard?.id === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              className={`
                min-w-[220px] p-4 rounded-xl border cursor-pointer
                ${isSelected ? "border-primary" : "border-border"}
              `}
            >

              <p className="text-sm text-muted-foreground">
                {card.name}
              </p>

              <p className="text-lg font-semibold">
                Limite: {card.creditLimit.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}