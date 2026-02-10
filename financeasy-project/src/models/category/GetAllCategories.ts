import type { PaginationResponse } from "../pagination/PaginationResponse";
import type { CategoryResponse } from "./CategoryResponse";

export type GetAllCategories = {
    categorys: CategoryResponse[];
    pagination: PaginationResponse
}