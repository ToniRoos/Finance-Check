import { raw } from "body-parser"
import { AccountData, AccountDataRow } from "common"
import { readJSON, writeJson, existsSync } from "fs-extra"
import path from 'path'

function bankAccountStore() {

    let accountListPath: string = ''

    function init(dataPath: string) {
        accountListPath = path.join(dataPath, 'accountList.json')
    }

    async function readAccountDataList() {

        if (!accountListPath) {
            throw new Error('AccountListPath not set. Call init method and set account list path')
        }

        let rawData: AccountData[] = []
        if (existsSync(accountListPath)) {
            rawData = await readJSON(accountListPath)
        }

        for (const accountData of rawData) {
            for (const item of accountData.data) {
                item.bookingDate = new Date(item.bookingDate);
            }
        }

        return rawData
    }

    async function addAccountData(payload: AccountData) {

        const accountList = await readAccountDataList()
        const bankAccountFiltered = accountList.filter(item => item.bankAccountNumber === payload.bankAccountNumber);
        if (bankAccountFiltered.length === 0) {

            accountList.push(payload);
        } else {

            const containedBankAccountData = bankAccountFiltered[0].data;
            payload.data.forEach(element => {
                const notContained = containedBankAccountData.filter(item => item.amount === element.amount
                    && item.bookingDate.getTime() === element.bookingDate.getTime()
                    && item.bankAccountNumber === element.bankAccountNumber).length === 0;

                if (notContained) {
                    containedBankAccountData.push(element);
                }
            });
            bankAccountFiltered[0].saldo = payload.saldo;
        }

        writeJson(accountListPath, accountList);
    }

    return {
        init,
        addAccountData,
        readAccountDataList
    }
}

const CostsIgnoreList = [
    "KREDITKARTENABRECHNUNG",
    "DKB VISACARD",
    "Kreditkarte"
]

// function calcualateOverallAmounts(accountList: AccountData[]) {

//     let data: AccountDataRow[] = [];
//     accountList.forEach(account => {
//         data.push(...account.data);
//     });

//     data = data.filter(item => {
//         const isInIgnoreList = CostsIgnoreList.filter(element => item.client.match(element) || item.reason.match(element)).length > 0;
//         return !isInIgnoreList;
//     });
//     data = data.sort(dateComparer);

//     return data;
// }

// function dateComparer(a: AccountDataRow, b: AccountDataRow) {

//     const numA = a.bookingDate.getTime();
//     const numB = b.bookingDate.getTime();

//     if (numA < numB) {
//         return 1;
//     }
//     if (numA > numB) {
//         return -1;
//     }
//     return 0;
// }

export default bankAccountStore()