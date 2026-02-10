export type CreateTransactionRequest = {
    bankAccountId: string;
    categoryId: string;
    paymentMethod: string;
    amount: number;
    date: Date;
    description: string;
}