import { useEffect, useState } from "react";

import { NavBar } from "@/components/layout/NavBar";

import { CardList } from "@/components/cards/CardList";
import { CardPurchases } from "@/components/cards/CardPurchase";
import { CardInvoices } from "@/components/cards/CardInvoices";

import type { CardResponse } from "@/models/card/CardResponse";
import type { BankAccountResponse } from "@/models/bankAccount/BankAccountResponse";
import type { GetAllBanksAccounts } from "@/models/bankAccount/GetAllBanksAccounts";
import { bankAccountService } from "@/services/BankAccountService";

export function Cards() {

  const [selectedCard, setSelectedCard] = useState<CardResponse | null>(null);
  const [banksAccounts, setBanksAccounts] = useState<GetAllBanksAccounts | null>(null);

  async function loadAccounts() {

    const response = await bankAccountService.getAll({
      page: 1,
      pageSize: 50,
      orderBy: "Bank",
      direction: "Desc",
    });

    setBanksAccounts(response);
  }

  useEffect(() => {
      loadAccounts();
  }, []);
  
  return (
    <section className="flex w-full h-screen overflow-hidden">

      <NavBar />

      <div className="flex flex-col w-full p-6 gap-6 overflow-y-auto">
        <CardList
          selectedCard={selectedCard}
          onSelectCard={setSelectedCard}
          banksAccounts={banksAccounts?.banksAccounts ?? null}
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