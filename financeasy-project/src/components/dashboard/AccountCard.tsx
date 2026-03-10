import { useState } from "react";
import { Button } from "@/components/ui/button";

import type { PaginationResponse } from "@/models/pagination/PaginationResponse";
import type { BankAccountResponse } from "@/models/bankAccount/BankAccountResponse";

interface AccountsCardProps {
  accounts: BankAccountResponse[];
  pagination: PaginationResponse
  loadAccounts: (page: number) => void;
}

export function AccountsCard({ accounts, pagination, loadAccounts }: AccountsCardProps) {

  const [visible, setVisible] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">Suas contas</h2>

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

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">

        {accounts?.map((acc) => {

          const isVisible = !!visible[acc.id];

          return (
            <div
              key={acc.id}
              className="min-w-[220px] bg-card border border-border rounded-xl p-4"
            >
              <p className="text-sm text-muted-foreground">
                {acc.bank}
              </p>

              <p className="text-lg font-semibold">
                {acc.balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          );

        })}
      </div>

      <span>Saldo total: {accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    </div>
  );
}