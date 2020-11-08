import { produce } from "immer";
import { Action } from "../logic/reducerStore";
import { FilterState } from "../pages/TablePage";
import * as fs from "fs";
import { trim } from "../logic/helper";

export interface FilterAction extends Action {
    type: "TOGGLE_FILTER"
    | "SET_FILTERLIST"
    | "SET_FILTERITEM_TEXT"
    | "MOVE_FILTER_ITEM"
    | "SET_FILTERITEM_TYPE"
    | "ADD_FILTERITEM"
    | 'REMOVE_FILTERITEM';
}

export const filterReducer = (prevState: FilterState, action: FilterAction) => {
    switch (action.type) {
        case 'SET_FILTERLIST':
            {
                prevState = produce(prevState, draft => {

                    const filterList = action.payload;
                    draft.data = filterList;
                });
                break;
            }
        case 'ADD_FILTERITEM':
            {
                prevState = produce(prevState, draft => {

                    // draft.data.push({ key: "", value: "", type: "text", isChecked: false });
                });
                break;
            }
        case 'REMOVE_FILTERITEM':
            {
                prevState = produce(prevState, draft => {

                    const filterKey = action.payload;
                    const filterItem = draft.data.filter(filter => filter.key !== filterKey);
                    draft.data = filterItem;
                });
                break;
            }
        case 'TOGGLE_FILTER':
            {
                prevState = produce(prevState, draft => {

                    const filterKey = action.payload;
                    const filterItem = draft.data.filter(filter => filter.key === filterKey)[0];
                    // filterItem.isChecked = !filterItem.isChecked;
                });
                break;
            }
        case 'SET_FILTERITEM_TEXT':
            {
                prevState = produce(prevState, draft => {

                    const filterKey = action.payload.filterKey;
                    const filterName = action.payload.filterName;
                    const filterItem = draft.data.filter(filter => filter.key === filterKey)[0];
                    filterItem.value = filterName;
                    filterItem.key = trim(filterName);
                });
                break;
            }
        case 'SET_FILTERITEM_TYPE':
            {
                prevState = produce(prevState, draft => {

                    const filterKey = action.payload.filterKey;
                    const filterType = action.payload.filtertype;
                    const filterItem = draft.data.filter(filter => filter.key === filterKey)[0];
                    // filterItem.type = filterType;
                });
                break;
            }
        case 'MOVE_FILTER_ITEM':
            {
                prevState = produce(prevState, draft => {

                    const filterKey = action.payload.filterKey;
                    let position = action.payload.position;

                    if (position < 0) {
                        position = 0;
                    }
                    if (position > draft.data.length - 1) {
                        position = draft.data.length - 1;
                    }
                    const filterItem = draft.data.filter(filter => filter.key === filterKey)[0];
                    const index = draft.data.indexOf(filterItem);

                    array_move(draft.data, index, position);
                });
                break;
            }
        default:
            break;
    };
    return prevState;
};

function array_move(arr: any[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};