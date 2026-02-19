import type { RecurrenceType } from "../category/RecurrenceType";

export type CreateAlert = {
    categoryId: string;
    recurrenceType: RecurrenceType;
    dueDate: Date;
    expectedAmount: number;
}