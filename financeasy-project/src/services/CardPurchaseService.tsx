import type { CreateCardPurchase } from "@/models/card/CreateCardPurchase";
import { apiClient } from "./ApiClient";
import type { PaginationRequest } from "@/models/pagination/PaginationRequest";
import type { GetAllCardPurchase } from "@/models/card/GetAllCardPurchases";

const path = "/card-purchases"

export const cardPurchaseService = {
    async create(cardPurchase: CreateCardPurchase) {
        const response = await apiClient.post(`${path}`, cardPurchase);

        return response;
    },

    async getAll(pagination: PaginationRequest): Promise<GetAllCardPurchase> {
        const response = await apiClient.get<GetAllCardPurchase>(`${path}/get-all/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`);

        return response;
    },

    async getAllByCard(cardId: string, pagination: PaginationRequest): Promise<GetAllCardPurchase> {
        const response = await apiClient.get<GetAllCardPurchase>(`${path}/get-all-by-card/${cardId}/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`);

        return response;
    }
}