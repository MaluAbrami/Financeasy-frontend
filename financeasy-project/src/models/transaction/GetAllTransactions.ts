import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { TransactionResponse } from "./TransactionResponse"

export type GetAllTransactions = {
    transactions: TransactionResponse[];
    pagination: PaginationResponse;
}