import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { cardService } from "@/services/CardService";

import type { CardResponse } from "@/models/card/CardResponse";
import type { CreateCard } from "@/models/card/CreateCard";
import type { BankAccountResponse } from "@/models/bankAccount/BankAccountResponse";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "../ui/popover";
import { ProportionBar } from "../layout/ProportionBar";

interface CardListProps {
  selectedCard: CardResponse | null;
  onSelectCard: (card: CardResponse) => void;
  banksAccounts: BankAccountResponse[] | null;
}

export function CardList({
  selectedCard,
  onSelectCard,
  banksAccounts
}: CardListProps) {

  const [cards, setCards] = useState<CardResponse[]>([]);

  const [createCard, setCreateCard] = useState<CreateCard>({
    bankAccountId: "",
    name: "",
    creditLimit: 0,
    dueDay: 1,
    closingDay: 1
  });

  async function handleCreateCard() {
    try {

      await cardService.create(createCard);

      await loadCards();

      setCreateCard({
        bankAccountId: "",
        name: "",
        creditLimit: 0,
        dueDay: 1,
        closingDay: 1
      });

    } catch (error) {
      console.error("Erro ao criar cartão", error);
    }
  }

  async function loadCards() {
    const data = await cardService.getAll({
      page: 1,
      pageSize: 10,
      orderBy: "CreditLimit",
      direction: "Desc"
    });

    setCards(data.cards ?? []);
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Seus cartões</h2>

        <Popover>

          <PopoverTrigger asChild>
            <Button size="sm">
              + Cartão
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80">

            <PopoverHeader>
              <PopoverTitle className="text-lg">Novo cartão</PopoverTitle>
            </PopoverHeader>

            <div className="flex flex-col gap-3 mt-3">

              {/* Banco */}
              <p className="font-semibold">Banco</p>
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={createCard.bankAccountId}
                onChange={(e) =>
                  setCreateCard((prev) => ({
                    ...prev,
                    bankAccountId: e.target.value
                  }))
                }
              >
                <option value="" className="bg-card">Selecione uma conta</option>

                {banksAccounts?.map((bank) => (
                  <option key={bank.id} value={bank.id} className="bg-card">
                    {bank.bank}
                  </option>
                ))}

              </select>

              {/* Nome */}
              <p>Nome</p>
              <input
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Nome do cartão"
                value={createCard.name}
                onChange={(e) =>
                  setCreateCard((prev) => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
              />

              {/* Limite */}
              <p>Limite de crédito</p>
              <input
                type="number"
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Limite de crédito"
                value={createCard.creditLimit}
                onChange={(e) =>
                  setCreateCard((prev) => ({
                    ...prev,
                    creditLimit: Number(e.target.value)
                  }))
                }
              />

              {/* Dia fechamento */}
              <p>Dia de fechamento</p>
              <input
                type="number"
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Dia de fechamento"
                value={createCard.closingDay}
                onChange={(e) =>
                  setCreateCard((prev) => ({
                    ...prev,
                    closingDay: Number(e.target.value)
                  }))
                }
              />

              {/* Dia vencimento */}
              <p>Dia de vencimento</p>
              <input
                type="number"
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Dia de vencimento"
                value={createCard.dueDay}
                onChange={(e) =>
                  setCreateCard((prev) => ({
                    ...prev,
                    dueDay: Number(e.target.value)
                  }))
                }
              />

              <Button
                size="sm"
                onClick={handleCreateCard}
                disabled={!createCard.bankAccountId || !createCard.name}
              >
                Criar cartão
              </Button>

            </div>

          </PopoverContent>

        </Popover>

      </div>

      {/* LISTA DE CARTÕES */}

      <div className="flex gap-4 overflow-x-auto">

        {cards.map((card) => {

          const isSelected = selectedCard?.id === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              className={`
                min-w-[320px] p-4 rounded-xl border cursor-pointer
                ${isSelected ? "border-primary" : "border-border"}
              `}
            >

              <p className="text-sm font-semibold">
                {card.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {card.bankAccountName}
              </p>

              <p className="text-sm text-muted-foreground">
                Fecha {card.closingDay} e Vence {card.dueDay}
              </p>

              <ProportionBar
                total={card.creditLimit}
                used={card.usedLimit}
                usedColor="bg-red-500"
                remainingColor="bg-green-500"
              />
              {/* Valores */}
              <div className="flex justify-between mt-4 text-sm">

                <p>
                  Em uso: {card.usedLimit.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                <p className={(card.creditLimit - card.usedLimit) < 0 ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
                  Disponível: {(card.creditLimit - card.usedLimit).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}