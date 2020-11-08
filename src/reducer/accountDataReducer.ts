import { produce } from "immer";
import { AccountDataRow } from "../DataRow";
import { AccountData, AccountDataContext } from "../logic/helper";
import { Action } from "../logic/reducerStore";

export interface DataAccountAction extends Action {
    type: "SET_DATA";
    payload: AccountData;
}

export const accountDataReducer = (prevState: AccountDataContext, action: DataAccountAction) => {
    switch (action.type) {
        case 'SET_DATA':
            {
                prevState = produce(prevState, draft => {

                    const bankAccountFiltered = draft.accountList.filter(item => item.bankAccountNumber === action.payload.bankAccountNumber);
                    if (bankAccountFiltered.length === 0) {
                        draft.accountList.push(action.payload);
                    } else {
                        // TODO concat data
                        const containedBankAccountData = bankAccountFiltered[0].data;
                        action.payload.data.forEach(element => {
                            const notContained = containedBankAccountData.filter(item => item.Amount === element.Amount
                                && item.BookingDate.getTime() === element.BookingDate.getTime()
                                && item.BankAccountNumber === element.BankAccountNumber).length === 0;

                            if (notContained) {
                                containedBankAccountData.push(element);
                            }
                        });
                        bankAccountFiltered[0].saldo = action.payload.saldo;
                    }
                    draft.data = [];
                    draft.accountList.forEach(account => {
                        draft.data.push(...account.data);
                    });
                    draft.data = draft.data.sort(dateComparer);
                });
                break;
            }
        default:
            break;
    };
    return prevState;
};

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