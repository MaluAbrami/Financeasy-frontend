import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";

import { bankAccountService } from "@/services/BankAccountService";

import type { PaginationResponse } from "@/models/pagination/PaginationResponse";
import type { BankAccountResponse } from "@/models/bankAccount/BankAccountResponse";
import type { CreateBankAccount } from "@/models/bankAccount/CreateBankAccount";

interface AccountsCardProps {
  accounts: BankAccountResponse[];
  pagination: PaginationResponse;
  loadAccounts: (page: number) => void;
}

export function AccountsCard({ accounts, pagination, loadAccounts }: AccountsCardProps) {

  const [createAccount, setCreateAccount] = useState<CreateBankAccount>({
    bank: "",
    balance: 0
  });
  const [editedBalances, setEditedBalances] = useState<Record<string, number>>({});
  const [updatingAccountId, setUpdatingAccountId] = useState<string | null>(null);

  async function handleCreateAccount() {
    try {

      await bankAccountService.create(createAccount);

      loadAccounts(pagination.page);

      setCreateAccount({
        bank: "",
        balance: 0
      });

    } catch (error) {
      console.error("Erro ao criar conta", error);
    }
  }

  async function handleUpdateBalance(account: BankAccountResponse) {
    const balance = editedBalances[account.id] ?? account.balance;

    try {
      setUpdatingAccountId(account.id);

      await bankAccountService.updateBalance({
        id: account.id,
        balance,
      });

      loadAccounts(pagination.page);
    } catch (error) {
      console.error("Erro ao atualizar saldo", error);
    } finally {
      setUpdatingAccountId(null);
    }
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">Suas contas</h2>

        <div className="flex items-center gap-3">

          {/* POPOVER NOVA CONTA */}
          <Popover>

            <PopoverTrigger asChild>
              <Button size="sm">
                + Conta
              </Button>
            </PopoverTrigger>

            <PopoverContent>

              <PopoverHeader>
                <PopoverTitle>Nova conta</PopoverTitle>
              </PopoverHeader>

              <div className="flex flex-col gap-3 mt-3">

                {/* Banco */}
                <input
                  className="border rounded-md px-3 py-2 text-sm"
                  placeholder="Nome do banco"
                  value={createAccount.bank}
                  onChange={(e) =>
                    setCreateAccount((prev) => ({
                      ...prev,
                      bank: e.target.value
                    }))
                  }
                />

                {/* Saldo */}
                <input
                  type="number"
                  className="border rounded-md px-3 py-2 text-sm"
                  placeholder="Saldo inicial"
                  value={createAccount.balance}
                  onChange={(e) =>
                    setCreateAccount((prev) => ({
                      ...prev,
                      balance: Number(e.target.value)
                    }))
                  }
                />

                <Button
                  size="sm"
                  onClick={handleCreateAccount}
                >
                  Criar conta
                </Button>

              </div>

            </PopoverContent>

          </Popover>

          {/* PAGINAÇÃO */}

          <div className="flex items-center gap-2 text-xs">

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAccounts(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              ←
            </Button>

            <span>{pagination.page}/{pagination.totalPages}</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAccounts(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              →
            </Button>

          </div>

        </div>

      </div>

      {/* CONTAS */}

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">

        {accounts?.map((acc) => (

          <div
            key={acc.id}
            className="min-w-55 bg-card border border-border rounded-xl p-4"
          >

            <div className="flex items-start justify-between gap-2">

              <p className="text-sm text-muted-foreground">
                {acc.bank}
              </p>

              <Popover>

                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    aria-label={`Editar saldo da conta ${acc.bank}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-64">

                  <PopoverHeader>
                    <PopoverTitle>Atualizar saldo</PopoverTitle>
                  </PopoverHeader>

                  <div className="mt-3 flex flex-col gap-3">
                    <input
                      type="number"
                      className="border rounded-md px-3 py-2 text-sm"
                      placeholder="Novo saldo"
                      value={editedBalances[acc.id] ?? acc.balance}
                      onChange={(e) =>
                        setEditedBalances((prev) => ({
                          ...prev,
                          [acc.id]: Number(e.target.value),
                        }))
                      }
                    />

                    <Button
                      size="sm"
                      onClick={() => handleUpdateBalance(acc)}
                      disabled={updatingAccountId === acc.id}
                    >
                      {updatingAccountId === acc.id ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>

                </PopoverContent>

              </Popover>

            </div>

            <p className="text-lg font-semibold">
              {acc.balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

          </div>

        ))}

      </div>

      {/* SALDO TOTAL */}

      <span>
        Saldo total: {accounts
          .reduce((sum, acc) => sum + acc.balance, 0)
          .toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
      </span>

    </div>
  );
}