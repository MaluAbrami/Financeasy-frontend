import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { BankAccountResponse } from "./BankAccountResponse";

export type GetAllBanksAccounts = {
    banksAccounts: BankAccountResponse[];
    pagination: PaginationResponse;
};