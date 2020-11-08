import { produce } from "immer";
import { AccountDataRow } from "../DataRow";
import { AccountData, AccountDataContext } from "../logic/helper";
import { Action } from "../logic/reducerStore";


export interface DataAccountAction extends Action {
    type: "SET_DATA";
    payload: AccountDataRow[];
}

export const accountDataReducer = (prevState: AccountData, action: DataAccountAction) => {
    switch (action.type) {
        case 'SET_DATA':
            {
                prevState = produce(prevState, draft => {

                    // if (draft.accountList.length === 0) {
                    //     draft.accountList.push(action.payload);
                    // }
                    draft.data = action.payload;
                });
                break;
            }
        default:
            break;
    };
    return prevState;
};