import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { CardPurchaseResponse } from "./CardPurchaseResponse"

export type GetAllCardPurchase = {
    purchases: CardPurchaseResponse[];
    pagination: PaginationResponse;
}