import type { PaginationRequest } from "@/models/pagination/PaginationRequest";
import { apiClient } from "./ApiClient";
import type { GetAllCategories } from "@/models/category/GetAllCategories";
import type { CategoryResponse } from "@/models/category/CategoryResponse";

const path = "/categories";

export const categoryService = {
    async getAll(pagination: PaginationRequest): Promise<GetAllCategories> {
        const response = await apiClient.get<GetAllCategories>(`${path}/all/${pagination.page}/${pagination.pageSize}/${pagination.orderBy}/${pagination.direction}`);

        return response;
    }
}