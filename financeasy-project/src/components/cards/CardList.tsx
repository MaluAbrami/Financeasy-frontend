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
  PopoverTrigger,
  PopoverClose,
} from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { ProportionBar } from "../layout/ProportionBar";

interface CardListProps {
  selectedCard: CardResponse | null;
  onSelectCard: (card: CardResponse) => void;
  banksAccounts: BankAccountResponse[] | null;
  refreshKey: number;
}

export function CardList({
  selectedCard,
  onSelectCard,
  banksAccounts,
  refreshKey
}: CardListProps) {

  const [cards, setCards] = useState<CardResponse[]>([]);

  const [createCard, setCreateCard] = useState<CreateCard>({
    bankAccountId: "",
    name: "",
    creditLimit: 0,
    dueDay: 1,
    closingDay: 1
  });
  const [showMobileCreate, setShowMobileCreate] = useState(false);

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
      setShowMobileCreate(false);

    } catch (error) {
      console.error("Erro ao criar cartão", error);
    }
  }

  function validateCreateCard() {
    const errors: Record<string, string> = {};

    if (!createCard.bankAccountId) errors.bankAccountId = "Escolha uma conta";
    if (!createCard.name || createCard.name.trim().length < 2) errors.name = "Nome deve ter ao menos 2 caracteres";
    if (createCard.creditLimit <= 0) errors.creditLimit = "Limite deve ser maior que zero";
    if (!Number.isInteger(createCard.closingDay) || createCard.closingDay < 1 || createCard.closingDay > 31) errors.closingDay = "Dia de fechamento inválido";
    if (!Number.isInteger(createCard.dueDay) || createCard.dueDay < 1 || createCard.dueDay > 31) errors.dueDay = "Dia de vencimento inválido";

    return errors;
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
  }, [refreshKey]);

  const createErrors = validateCreateCard();

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Seus cartões</h2>

        {/* Desktop: popover; Mobile: dialog */}
        <div className="hidden sm:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm">+ Cartão</Button>
            </PopoverTrigger>

            <PopoverContent className="w-80">
              <PopoverHeader>
                <PopoverTitle className="text-lg">Novo cartão</PopoverTitle>
              </PopoverHeader>

              <div className="flex flex-col gap-3 mt-3">
                <label className="font-semibold">Banco</label>
                <select
                  className={`border rounded-md px-3 py-2 text-sm ${createErrors.bankAccountId ? 'border-destructive' : ''}`}
                  value={createCard.bankAccountId}
                  onChange={(e) => setCreateCard((prev) => ({ ...prev, bankAccountId: e.target.value }))}
                  aria-invalid={!!createErrors.bankAccountId}
                  aria-describedby={createErrors.bankAccountId ? 'err-bank' : undefined}
                >
                  <option value="" className="bg-card">Selecione uma conta</option>
                  {banksAccounts?.map((bank) => (
                    <option key={bank.id} value={bank.id} className="bg-card">{bank.bank}</option>
                  ))}
                </select>
                {createErrors.bankAccountId && <p id="err-bank" className="text-xs text-destructive mt-1">{createErrors.bankAccountId}</p>}

                <label>Nome</label>
                <input className={`border rounded-md px-3 py-2 text-sm ${createErrors.name ? 'border-destructive' : ''}`} placeholder="Nome do cartão" value={createCard.name} onChange={(e) => setCreateCard((prev) => ({ ...prev, name: e.target.value }))} aria-invalid={!!createErrors.name} aria-describedby={createErrors.name ? 'err-name' : undefined} />
                {createErrors.name && <p id="err-name" className="text-xs text-destructive mt-1">{createErrors.name}</p>}

                <label>Limite de crédito</label>
                <input type="number" min={0} step={0.01} inputMode="decimal" className={`border rounded-md px-3 py-2 text-sm ${createErrors.creditLimit ? 'border-destructive' : ''}`} placeholder="Limite de crédito" value={createCard.creditLimit} onChange={(e) => setCreateCard((prev) => ({ ...prev, creditLimit: Number(e.target.value) }))} aria-invalid={!!createErrors.creditLimit} aria-describedby={createErrors.creditLimit ? 'err-limit' : undefined} />
                {createErrors.creditLimit && <p id="err-limit" className="text-xs text-destructive mt-1">{createErrors.creditLimit}</p>}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label>Dia de fechamento</label>
                    <input type="number" min={1} max={31} className={`border rounded-md px-3 py-2 text-sm w-full ${createErrors.closingDay ? 'border-destructive' : ''}`} placeholder="Dia de fechamento" value={createCard.closingDay} onChange={(e) => setCreateCard((prev) => ({ ...prev, closingDay: Number(e.target.value) }))} aria-invalid={!!createErrors.closingDay} aria-describedby={createErrors.closingDay ? 'err-closing' : undefined} />
                    {createErrors.closingDay && <p id="err-closing" className="text-xs text-destructive mt-1">{createErrors.closingDay}</p>}
                  </div>
                  <div>
                    <label>Dia de vencimento</label>
                    <input type="number" min={1} max={31} className={`border rounded-md px-3 py-2 text-sm w-full ${createErrors.dueDay ? 'border-destructive' : ''}`} placeholder="Dia de vencimento" value={createCard.dueDay} onChange={(e) => setCreateCard((prev) => ({ ...prev, dueDay: Number(e.target.value) }))} aria-invalid={!!createErrors.dueDay} aria-describedby={createErrors.dueDay ? 'err-due' : undefined} />
                    {createErrors.dueDay && <p id="err-due" className="text-xs text-destructive mt-1">{createErrors.dueDay}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <PopoverClose asChild>
                    <Button size="sm" variant="ghost">Cancelar</Button>
                  </PopoverClose>
                  <Button size="sm" onClick={handleCreateCard} disabled={Object.keys(createErrors).length > 0}>Criar cartão</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="block sm:hidden">
          <Button size="sm" onClick={() => setShowMobileCreate(true)}>+ Cartão</Button>

          {showMobileCreate && (
            <div className="fixed inset-0 z-50 flex items-start pt-16 px-4">
              <div className="bg-card w-full rounded-lg p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Novo cartão</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileCreate(false)} aria-label="Fechar">✕</Button>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-semibold">Banco</label>
                  <select className={`border rounded-md px-3 py-2 text-sm ${createErrors.bankAccountId ? 'border-destructive' : ''}`} value={createCard.bankAccountId} onChange={(e) => setCreateCard((prev) => ({ ...prev, bankAccountId: e.target.value }))} aria-invalid={!!createErrors.bankAccountId} aria-describedby={createErrors.bankAccountId ? 'err-bank' : undefined}>
                    <option value="" className="bg-card">Selecione uma conta</option>
                    {banksAccounts?.map((bank) => (
                      <option key={bank.id} value={bank.id} className="bg-card">{bank.bank}</option>
                    ))}
                  </select>
                  {createErrors.bankAccountId && <p id="err-bank" className="text-xs text-destructive mt-1">{createErrors.bankAccountId}</p>}

                  <label>Nome</label>
                  <input className={`border rounded-md px-3 py-2 text-sm ${createErrors.name ? 'border-destructive' : ''}`} placeholder="Nome do cartão" value={createCard.name} onChange={(e) => setCreateCard((prev) => ({ ...prev, name: e.target.value }))} aria-invalid={!!createErrors.name} aria-describedby={createErrors.name ? 'err-name' : undefined} />
                  {createErrors.name && <p id="err-name" className="text-xs text-destructive mt-1">{createErrors.name}</p>}

                  <label>Limite de crédito</label>
                  <input type="number" min={0} step={0.01} inputMode="decimal" className={`border rounded-md px-3 py-2 text-sm ${createErrors.creditLimit ? 'border-destructive' : ''}`} placeholder="Limite de crédito" value={createCard.creditLimit} onChange={(e) => setCreateCard((prev) => ({ ...prev, creditLimit: Number(e.target.value) }))} aria-invalid={!!createErrors.creditLimit} aria-describedby={createErrors.creditLimit ? 'err-limit' : undefined} />
                  {createErrors.creditLimit && <p id="err-limit" className="text-xs text-destructive mt-1">{createErrors.creditLimit}</p>}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label>Dia de fechamento</label>
                      <input type="number" min={1} max={31} className={`border rounded-md px-3 py-2 text-sm w-full ${createErrors.closingDay ? 'border-destructive' : ''}`} placeholder="Dia de fechamento" value={createCard.closingDay} onChange={(e) => setCreateCard((prev) => ({ ...prev, closingDay: Number(e.target.value) }))} aria-invalid={!!createErrors.closingDay} aria-describedby={createErrors.closingDay ? 'err-closing' : undefined} />
                      {createErrors.closingDay && <p id="err-closing" className="text-xs text-destructive mt-1">{createErrors.closingDay}</p>}
                    </div>
                    <div>
                      <label>Dia de vencimento</label>
                      <input type="number" min={1} max={31} className={`border rounded-md px-3 py-2 text-sm w-full ${createErrors.dueDay ? 'border-destructive' : ''}`} placeholder="Dia de vencimento" value={createCard.dueDay} onChange={(e) => setCreateCard((prev) => ({ ...prev, dueDay: Number(e.target.value) }))} aria-invalid={!!createErrors.dueDay} aria-describedby={createErrors.dueDay ? 'err-due' : undefined} />
                      {createErrors.dueDay && <p id="err-due" className="text-xs text-destructive mt-1">{createErrors.dueDay}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setShowMobileCreate(false)}>Cancelar</Button>
                    <Button size="sm" onClick={handleCreateCard} disabled={Object.keys(createErrors).length > 0}>Criar cartão</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* LISTA DE CARTÕES */}

      <div className="flex gap-4 overflow-x-auto">

          {cards.map((card) => {

          const isSelected = selectedCard?.id === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              className={`relative min-w-[320px] p-4 rounded-xl border cursor-pointer ${isSelected ? "border-primary" : "border-border"}`}
            >

              <div className="absolute top-3 right-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} aria-label={`Ações do cartão ${card.name}`}>
                      <MoreHorizontal size={16} />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-44">
                    <div className="flex flex-col">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onSelectCard(card); }}>
                        Abrir
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onSelectCard(card); }}>
                        Ver faturas
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

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
                usedColor = "bg-red-800"
                remainingColor = "bg-emerald-700"
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