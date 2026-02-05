import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { CardResponse } from "./CardResponse";

export type GetAllCards = {
    cards: CardResponse[];
    pagination: PaginationResponse;
};