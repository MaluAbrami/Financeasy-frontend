export type CardPurchaseResponse = {
    id: string;
    cardName: string;
    categoryName: string;
    totalAmount: number;
    installments: number;
    purchaseDate: Date;
    description: string;
}