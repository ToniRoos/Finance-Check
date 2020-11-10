import { produce } from "immer";
import { Action } from "../logic/reducerStore";
import { CategoryList } from "../pages/SettingsPage";

export interface SettingsAction extends Action {
    type: "SET_CATEGORIES"
    | "ADD_EMPTY_CATEGORY_MATCH"
    | "CHANGE_CATEGORY_TITLE"
    | "CHANGE_CATEGORY_MATCH_TEXT"
    | "REMOVE_CATEGORY_MATCH"
    | "ADD_CATEGORY"
    | "REMOVE_CATEGORY"
    | "MOVE_CATEGORY";
    // "TOGGLE_FILTER"
    // | "SET_FILTERLIST"
    // | "SET_FILTERITEM_TEXT"
    // | "MOVE_FILTER_ITEM"
    // | "SET_FILTERITEM_TYPE"
    // | "ADD_FILTERITEM"
    // | 'REMOVE_FILTERITEM';
}

export const settingsReducer = (prevState: CategoryList, action: SettingsAction) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            {
                prevState = produce(prevState, draft => {

                    const categories = action.payload;
                    draft.categories = categories;
                });
                break;
            }
        case 'ADD_CATEGORY':
            {
                prevState = produce(prevState, draft => {

                    draft.categories.push({ title: "", matches: [""] });
                });
                break;
            }
        case 'REMOVE_CATEGORY':
            {
                prevState = produce(prevState, draft => {

                    draft.categories = draft.categories.filter(item => item.title !== action.payload);
                });
                break;
            }
        case 'MOVE_CATEGORY':
            {
                prevState = produce(prevState, draft => {

                    const title = action.payload.title;
                    let position = action.payload.position;

                    if (position < 0) {
                        position = 0;
                    }
                    if (position > draft.categories.length - 1) {
                        position = draft.categories.length - 1;
                    }
                    const categoryItem = draft.categories.filter(category => category.title === title)[0];
                    const index = draft.categories.indexOf(categoryItem);

                    array_move(draft.categories, index, position);
                });
                break;
            }
        case 'ADD_EMPTY_CATEGORY_MATCH':
            {
                prevState = produce(prevState, draft => {

                    draft.categories.filter(item => item.title === action.payload)[0].matches.push("");
                });
                break;
            }
        case 'REMOVE_CATEGORY_MATCH':
            {
                prevState = produce(prevState, draft => {

                    draft.categories.filter(item => item.title === action.payload.title)[0].matches.splice(action.payload.matchIndex, 1);
                });
                break;
            }
        case 'CHANGE_CATEGORY_MATCH_TEXT':
            {
                prevState = produce(prevState, draft => {

                    draft.categories.filter(item => item.title === action.payload.title)[0].matches[action.payload.matchIndex] = action.payload.matchText;
                });
                break;
            }
        case 'CHANGE_CATEGORY_TITLE':
            {
                prevState = produce(prevState, draft => {
                    draft.categories.filter(item => item.title === action.payload.titlePrev)[0].title = action.payload.titleNext;
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