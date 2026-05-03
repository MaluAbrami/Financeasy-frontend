import type { CreateCard } from "@/models/card/CreateCard";
import type { GetAllCards } from "../models/card/GetAllCards";
import type { PaginationRequest } from "../models/pagination/PaginationRequest";
import { apiClient } from "./ApiClient";
import type { UpdateCardRequest } from "@/models/card/UpdateCardRequest";
import type { UpdateCardResponse } from "@/models/card/UpdateCardResponse";

const path = "/cards"

export const cardService = {
    async getAll(pagination: PaginationRequest) : Promise<GetAllCards> {
        const response = await apiClient.get<GetAllCards>(`${path}/get-all/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`);

        return response;
    },

    async create(card: CreateCard) {
        var response = await apiClient.post<CreateCard>(`${path}`, card);

        return response;
    },

    async delete(id: string) {
        await apiClient.del(`${path}/${id}`);
    },

    async update(request: UpdateCardRequest) {
        var response = await apiClient.patch<UpdateCardResponse>(`${path}/update/${request.cardId}`);

        return response;
    }
}