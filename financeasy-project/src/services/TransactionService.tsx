import type { PaginationRequest } from "../models/pagination/PaginationRequest";
import type { GetAllTransactions } from "../models/transaction/GetAllTransactions";
import { apiClient } from "./ApiClient";

const path = "/transactions"

export const transactionService = { 
    async getAll(pagination: PaginationRequest): Promise<GetAllTransactions> {
        var response = await apiClient.get<GetAllTransactions>(`${path}/get-all/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`);

        return response;
    }
}