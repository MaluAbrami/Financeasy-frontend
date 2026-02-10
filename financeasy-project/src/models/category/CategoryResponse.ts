import type { RecurrenceType } from "./RecurrenceType";

export type CategoryResponse = {
    id: string;
    name: string;
    type: "Income" | "Expense";
    recurrenceType: RecurrenceType
}