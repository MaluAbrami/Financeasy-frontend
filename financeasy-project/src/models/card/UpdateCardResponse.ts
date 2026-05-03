export type UpdateCardResponse = {
    id: string,
    name: string,
    bankAccountId: string,
    creditLimit: number,
    closingDay: number,
    dueDay: number,
    isActive: boolean
}