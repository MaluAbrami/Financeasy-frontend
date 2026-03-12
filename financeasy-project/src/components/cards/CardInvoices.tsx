import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { cardInvoiceService } from "@/services/CardInvoiceService";

import type { CardInvoiceResponse } from "@/models/card/CardInvoiceResponse";

interface CardInvoicesProps {
  cardId: string;
}

export function CardInvoices({ cardId }: CardInvoicesProps) {

  const [invoices, setInvoices] = useState<CardInvoiceResponse[]>([]);

  async function loadInvoices() {
    const data = await cardInvoiceService.getAllByCard(cardId, {
        page: 1, 
        pageSize: 10,
        orderBy: "ClosingDate",
        direction: "Asc"
    } );
    setInvoices(data.invoices ?? []);
  }

  useEffect(() => {
    loadInvoices();
  }, [cardId]);

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      <h2 className="text-lg font-semibold mb-4">
        Faturas
      </h2>

      <div className="flex flex-col gap-2">

        {invoices.map((invoice) => (

          <div
            key={invoice.id}
            className="flex justify-between items-center border rounded-lg p-3"
          >

            <div>

              <p className="font-medium">
                {new Date(invoice.closingDate).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric"
                })}
              </p>

              <p className="text-xs text-muted-foreground">
                Vence em {new Date(invoice.dueDate).toLocaleDateString("pt-BR")}
              </p>

            </div>

            <div className="flex items-center gap-4">

              <p className="font-semibold">
                {invoice.totalAmount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>

              {invoice.totalAmount > 0 && (
                <Button size="sm">
                  Pagar
                </Button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}