import { apiClient } from "./ApiClient";
import type { PaginationRequest } from "@/models/pagination/PaginationRequest";
import type { GetAllInvoicesResponse } from "@/models/card/GetAllInvoicesResponse";
import type { CardInvoiceResponse } from "@/models/card/CardInvoiceResponse";

const path = "/card-invoices"

export const cardInvoiceService = {
    async getAllByCard(cardId: string, pagination: PaginationRequest): Promise<GetAllInvoicesResponse> {
        const response = await apiClient.get<GetAllInvoicesResponse>(`${path}/get-all-by-card/${cardId}/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`);

        return response;
    },

    async getByCardAndPeriod(cardId: string, month: number, year: number): Promise<CardInvoiceResponse> {
        const response = await apiClient.get<CardInvoiceResponse>(`${path}/get-by-period/${cardId}/${month}/${year}`);

        return response;
    }
}