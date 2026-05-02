import type { PaginationRequest } from "../models/pagination/PaginationRequest";
import { apiClient } from "./ApiClient";
import type { GetAllAlerts } from "@/models/alert/GetAllAlerts";
import type { CreateAlert } from "@/models/alert/CreateAlert";

const path = "/alerts"

export const alertService = {
    async getAll(month: number, year: number, pagination: PaginationRequest): Promise<GetAllAlerts> {
        const response = await apiClient.get<GetAllAlerts>(
            `${path}/all-by-month/${month}/${year}/${pagination.page}/${pagination.pageSize}`
        );

        return response;
    },

    async create(alert: CreateAlert) {
        await apiClient.post(`${path}`, alert);
    },

    async delete(id: string) {
        await apiClient.del(`${path}/${id}`);
    },

    async payAlert(id: string) {
        await apiClient.patch(`${path}/pay-alert/${id}`);
    }
}