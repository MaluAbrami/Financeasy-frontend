export const RecurrenceType = {
    None: "None",
    Fortnightly: "Fortnightly",
    Monthly: "Monthly",
    Quarterly: "Quarterly",
    Semiannul: "Semiannul",
    Annual: "Annual"
} as const;

export type RecurrenceType = typeof RecurrenceType[keyof typeof RecurrenceType];