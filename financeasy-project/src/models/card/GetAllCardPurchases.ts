import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { CardPurchaseResponse } from "./CardPurchaseResponse"

export type GetAllCardPurchase = {
    cardPurchases: CardPurchaseResponse[];
    pagination: PaginationResponse;
}