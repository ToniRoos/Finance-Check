export interface AccountData {
    data: AccountDataRow[];
    bankAccountNumber: string;
    saldo?: number;
}

export interface AccountDataRow {
    BookingDate: Date;
    // ValueDate: Date;
    // BookingText: string;
    Client: string;
    Reason: string;
    BankAccountNumber: string;
    // BankCode: string;

    Creditor: string;
    Amount: number;
    // ClientReference: string;
    // CustomerReference: string;
}