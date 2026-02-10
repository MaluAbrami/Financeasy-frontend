import type { CreateBankAccount } from "@/models/bankAccount/CreateBankAccount";
import type { GetAllBanksAccounts } from "../models/bankAccount/GetAllBanksAccounts";
import type { PaginationRequest } from "../models/pagination/PaginationRequest";
import { apiClient } from "./ApiClient";

const path = "/bank-accounts"

export const bankAccountService = {
    async getAll(pagination: PaginationRequest): Promise<GetAllBanksAccounts> {
        const response = await apiClient.get<GetAllBanksAccounts>(
            `${path}/get-all/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`
        );

        return response;
    },

    async create(bankAccount: CreateBankAccount) {
        await apiClient.post(`${path}`, bankAccount);
    }
}