import type { PaginationResponse } from "../pagination/PaginationResponse"
import type { CardInvoiceResponse } from "./CardInvoiceResponse"

export type GetAllInvoicesResponse = {
    invoices: CardInvoiceResponse[],
    pagination: PaginationResponse
}