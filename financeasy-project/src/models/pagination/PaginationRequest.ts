export type PaginationRequest = {
    page: number;
    pageSize: number;
    orderBy: string;
    direction: "Asc" | "Desc";
};