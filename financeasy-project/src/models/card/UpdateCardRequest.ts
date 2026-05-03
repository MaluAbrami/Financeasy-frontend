export type UpdateCardRequest = {
    cardId: string,
    name: string,
    creditLimit: number,
    closingDay: number,
    dueDay: number
}