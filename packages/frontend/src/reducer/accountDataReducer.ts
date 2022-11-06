import { produce } from "immer";
import { AccountDataRow } from "common";
import { AccountData, AccountDataContext } from "../logic/helper";
import { Action } from "../logic/reducerStore";
// import * as fs from "fs";

export interface DataAccountActionSetData extends Action {
    type: "SET_DATA";
    payload: AccountData;
}
export interface DataAccountActionInitial extends Action {
    type: "SET_INITAL_DATA";
    payload: AccountData[];
}

const CostsIgnoreList = [
    "KREDITKARTENABRECHNUNG",
    "DKB VISACARD",
    "Kreditkarte"
]

export const accountDataReducer = (prevState: AccountDataContext, action: DataAccountActionSetData | DataAccountActionInitial) => {
    switch (action.type) {
        case 'SET_DATA':
            {
                const payload = action.payload;
                prevState = produce(prevState, draft => {

                    const bankAccountFiltered = draft.accountList.filter(item => item.bankAccountNumber === payload.bankAccountNumber);
                    if (bankAccountFiltered.length === 0) {

                        draft.accountList.push(payload);
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
                    draft.data = calcualateOverallAmounts(draft.accountList);

                    let data = JSON.stringify({ accountList: draft.accountList }, null, 4);
                    // fs.writeFileSync(resolveAccountListPath(), data);
                });
                break;
            }
        case 'SET_INITAL_DATA':
            {
                const payload = action.payload;
                prevState = produce(prevState, draft => {

                    draft.accountList = payload;

                    draft.accountList.forEach(item => item.data = item.data.sort(dateComparer));

                    draft.data = calcualateOverallAmounts(draft.accountList);
                });
                break;
            }
        default:
            break;
    };
    return prevState;
};

function calcualateOverallAmounts(accountList: AccountData[]) {

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