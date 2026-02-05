import type { PaymentMethod } from "./PaymentMethod";

export type TransactionResponse = {
    id: string;
    bankAccountName: string;
    categoryName: string;
    paymentMethod: PaymentMethod;
    amount: number;
    date: string;
    description: string;
}