import { AccountData } from "common"
import { readJSON, writeJson, existsSync } from "fs-extra"
import _ from "lodash"
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

            accountData.data = _.sortBy(accountData.data, item => item.bookingDate).reverse()

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
                const contained = _.some(containedBankAccountData, item => item.amount === element.amount
                    && item.bookingDate.getTime() === element.bookingDate.getTime()
                    && item.bankAccountNumber === element.bankAccountNumber);

                if (!contained) {
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

export default bankAccountStore()