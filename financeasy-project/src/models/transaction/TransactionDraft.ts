import type { PaymentMethod } from "./PaymentMethod";

export type TransactionDraft = {
    id: string;              
    bankAccountId: string;   
    categoryId: string;      
    paymentMethod: string;   
    amount: string;          
    date: Date;
    description: string;
}