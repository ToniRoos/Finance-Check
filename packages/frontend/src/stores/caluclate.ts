import { AccountData, AccountDataRow } from "common";

export function calcualateOverallAmounts(accountList: AccountData[]) {

    let data: AccountDataRow[] = [];
    accountList.forEach(account => {
        data.push(...account.data);
    });

    data = data.filter(item => {
        const isInIgnoreList = CostsIgnoreList.filter(element => item.client.match(element) || item.reason.match(element)).length > 0;
        return !isInIgnoreList;
    });
    data = data.sort(dateComparer);

    return data;
}

function dateComparer(a: AccountDataRow, b: AccountDataRow) {

    const numA = a.bookingDate.getTime();
    const numB = b.bookingDate.getTime();

    if (numA < numB) {
        return 1;
    }
    if (numA > numB) {
        return -1;
    }
    return 0;
}

const CostsIgnoreList = [
    "KREDITKARTENABRECHNUNG",
    "DKB VISACARD",
    "Kreditkarte"
]