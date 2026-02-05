export const PaymentMethod = {
    Pix: "Pix",
    DebtCard: "DebtCard",
    Transfer: "Transfer",
    Cash: "Cash"
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];