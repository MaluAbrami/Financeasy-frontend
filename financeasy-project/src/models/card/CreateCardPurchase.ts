export type CreateCardPurchase = {
    cardId: string;
    categoryId: string;
    totalAmount: number;
    installments: number;
    purchaseDate: Date;
    description: string;
}