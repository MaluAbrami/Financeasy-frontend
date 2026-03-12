import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import type { BankAccountResponse } from "@/models/bankAccount/BankAccountResponse";
import type { CategoryResponse } from "@/models/category/CategoryResponse";
import type { CardResponse } from "@/models/card/CardResponse";
import type { CreateTransactionRequest } from "@/models/transaction/CreateTransactionRequest";
import type { CreateCardPurchase } from "@/models/card/CreateCardPurchase";

import { MonthlyTransactionsTable } from "./MonthlyTransactionsTable";
import { MonthlyCardPurchasesTable } from "./MonthlyCardPurchasesTable";

type Props = {
  bankAccounts: BankAccountResponse[];
  categories: CategoryResponse[];
  cards: CardResponse[];

  onSubmitTransactions: (payload: CreateTransactionRequest[]) => Promise<void> | void;
  onSubmitCardPurchases: (payload: CreateCardPurchase[]) => Promise<void> | void;
  refreshDashboard: () => void;
};

export function MonthlyEntriesSection({
  bankAccounts,
  cards,
  categories,
  onSubmitTransactions,
  onSubmitCardPurchases,
  refreshDashboard
}: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Lançamentos - Acesso rápido
        </h3>
        <p className="text-sm text-muted-foreground">
          Transações normais alteram saldo. Compras no cartão não.
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="card">Cartão</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <MonthlyTransactionsTable
            bankAccounts={bankAccounts}
            categories={categories}
            onSubmit={onSubmitTransactions}
            refreshDashboard={refreshDashboard}
          />
        </TabsContent>

        <TabsContent value="card" className="mt-6">
          <MonthlyCardPurchasesTable
            cards={cards}
            categories={categories}
            onSubmit={onSubmitCardPurchases}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
