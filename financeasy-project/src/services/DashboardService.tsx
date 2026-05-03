import { apiClient } from "./ApiClient";
import type { SpendingMonthlyControlResponse } from "@/models/dashboards/SpendingMonthlyControlResponse";

const path = "/dashboards"

export const dashboardService = { 
    async spedingMothlyControl(month: number, year: number): Promise<SpendingMonthlyControlResponse> {
        var response = await apiClient.get<SpendingMonthlyControlResponse>(`${path}/speding-monthly-control/${month}/${year}`);

        return response;
    },
}