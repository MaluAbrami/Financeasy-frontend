import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { AlertResponse } from "./AlertResponse"

export type GetAllAlerts = {
    alerts: AlertResponse[];
    pagination: PaginationResponse
}