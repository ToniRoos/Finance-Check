import { AccountData } from "../logic/helper";

export async function fetchBankAccountData() {
    const bankAccounts = await (await fetch('/api/bank-account-data')).json() as AccountData[]
    for (const bankAccount of bankAccounts) {
        for (const item of bankAccount.data) {
            item.bookingDate = new Date(item.bookingDate);
        }
    }
    return bankAccounts
}

export async function uploadCsv(data: any) {
    console.log('uploadCsv', data)
    const bankAccountData = await fetch('/api/upload-csv', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return bankAccountData
}