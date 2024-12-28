export enum PaymentMethod{
    CREDIT_CARD = 'credit_card',
    CASH = 'cash',
    DIGITAL_WALLET= 'digital_wallet',
    BANK_TRANSFER = 'bank_transfer',

}
export enum AccountStatus {
    active = 'Active',
    pedingVerify = 'PendingVerify',
    blocked = 'Blocked',
    deleted = 'Deleted',
    verify = 'Verified'
}
export enum UserRoles {
    owner = 'Owner',
    employee = 'Employee',
    customer = 'Customer',
}
