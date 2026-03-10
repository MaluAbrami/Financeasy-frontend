import { useState } from "react";

import { NavBar } from "@/components/layout/NavBar";

import { CardList } from "@/components/cards/CardList";
import { CardPurchases } from "@/components/cards/CardPurchase";
import { CardInvoices } from "@/components/cards/CardInvoices";

import type { CardResponse } from "@/models/card/CardResponse";

export function Cards() {

  const [selectedCard, setSelectedCard] = useState<CardResponse | null>(null);

  return (
    <section className="flex w-full h-screen overflow-hidden">

      <NavBar />

      <div className="flex flex-col w-full p-6 gap-6 overflow-y-auto">

        <CardList
          selectedCard={selectedCard}
          onSelectCard={setSelectedCard}
        />

        {selectedCard && (
          <CardPurchases cardId={selectedCard.id} />
        )}

        {selectedCard && (
          <CardInvoices cardId={selectedCard.id} />
        )}

      </div>

    </section>
  );
}