import { produce } from "immer";
import { AccountDataRow } from "../components/DataRow";
import { AccountData, AccountDataContext } from "../logic/helper";
import { Action } from "../logic/reducerStore";
import * as fs from "fs";
import { resolveAccountListPath } from "../types";
import { CategroyItem } from "../pages/SettingsPage";

export interface DataAccountAction extends Action {
    type: "SET_DATA" | "SET_INITAL_DATA";
    payload: AccountData | AccountData[];
}

const KREDITKARTENABRECHNUNG = "KREDITKARTENABRECHNUNG";
const DKB_VISACARD = "DKB VISACARD";
const Kreditkarte = "Kreditkarte";
const CostsIgnoreList = [
    KREDITKARTENABRECHNUNG,
    DKB_VISACARD,
    Kreditkarte
]

export const accountDataReducer = (prevState: AccountDataContext, action: DataAccountAction) => {
    switch (action.type) {
        case 'SET_DATA':
            {
                const payload = action.payload as AccountData;
                prevState = produce(prevState, draft => {

                    const bankAccountFiltered = draft.accountList.filter(item => item.bankAccountNumber === payload.bankAccountNumber);
                    if (bankAccountFiltered.length === 0) {

                        draft.accountList.push(payload);
                    } else {

                        const containedBankAccountData = bankAccountFiltered[0].data;
                        payload.data.forEach(element => {
                            const notContained = containedBankAccountData.filter(item => item.Amount === element.Amount
                                && item.BookingDate.getTime() === element.BookingDate.getTime()
                                && item.BankAccountNumber === element.BankAccountNumber).length === 0;

                            if (notContained) {
                                containedBankAccountData.push(element);
                            }
                        });
                        bankAccountFiltered[0].saldo = payload.saldo;
                    }
                    draft.data = calcualateOverallAmounts(draft.accountList);

                    let data = JSON.stringify({ accountList: draft.accountList }, null, 4);
                    fs.writeFileSync(resolveAccountListPath(), data);
                });
                break;
            }
        case 'SET_INITAL_DATA':
            {
                const payload = action.payload as AccountData[];
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

    // const creaditCardBillingsToRemove: AccountDataRow[] = [];
    // data.filter(item => {
    //     const amount = item.Amount;
    //     const date = item.BookingDate;
    //     const creditCardBillingForItem = data.filter(element => element.Amount === (-1 * amount)
    //         && (element.BookingDate.getTime() - date.getTime() < (5 * 24 * 60 * 60 * 1000)));

    //     if (creditCardBillingForItem.length === 1) {
    //         creaditCardBillingsToRemove.push(item);
    //         creaditCardBillingsToRemove.push(creditCardBillingForItem[0]);
    //     }
    // });

    // data = data.filter(item => creaditCardBillingsToRemove.indexOf(item) < 0);
    data = data.filter(item => {
        const isInIgnoreList = CostsIgnoreList.filter(element => item.Client.match(element) || item.Reason.match(element)).length > 0;
        return !isInIgnoreList;
    });
    data = data.sort(dateComparer);

    return data;
}

function dateComparer(a: AccountDataRow, b: AccountDataRow) {

    const numA = a.BookingDate.getTime();
    const numB = b.BookingDate.getTime();

    if (numA < numB) {
        return 1;
    }
    if (numA > numB) {
        return -1;
    }
    return 0;
}