import type { RecurrenceType } from "../category/RecurrenceType";

export type CreateAlert = {
    categoryId: string;
    recurrenceType: string;
    dueDate: Date;
    expectedAmount: number;
    startDate: Date | null;
    endDate: Date | null;
}