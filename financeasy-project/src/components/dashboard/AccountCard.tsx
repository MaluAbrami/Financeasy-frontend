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

      <ul className="mt-4 flex flex-col gap-2">

        {accounts?.map((acc) => {

          const isVisible = !!visible[acc.id];

          return (
            <li key={acc.id} className="p-3 border rounded-xl">

              <div className="flex justify-between">

                <span className="font-semibold">{acc.bank}</span>

                <button
                  onClick={() => toggle(acc.id)}
                  className="text-xs text-muted-foreground"
                >
                  {isVisible ? "Ocultar" : "Mostrar"}
                </button>

              </div>

              <div className="mt-1 font-semibold">

                {isVisible
                  ? acc.balance.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$ ******"}

              </div>

            </li>
          );
        })}

      </ul>
    </div>
  );
}