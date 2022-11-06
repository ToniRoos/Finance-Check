import * as React from "react";
import { settingsStore } from "../../stores/settingsStore";
import Draggable from "react-draggable";
import { SettingsAction } from "./settingsReducer";

export interface CategroyItem {
    title: string;
    matches: string[];
}

export interface CategoryList {
    categories: CategroyItem[];
}

const Settings = () => {

    const { state: settings, dispatch } = React.useContext(settingsStore);

    const mappedCategories = settings.categories.map((categoryItem, i) => <Draggable key={i} axis="y" position={{ x: 0, y: 0 }} onStop={(event, data) => {

        const height = data.node.clientHeight;
        const transY = data.lastY;

        const elementsToMove = parseInt((transY / height) + "");
        const diff = i + elementsToMove;

        dispatch({ type: "MOVE_CATEGORY", payload: { title: categoryItem.title, position: diff } });

    }}>
        <tr>
            <td><input className="border-0 bg-transparent text-dark"
                value={categoryItem.title}
                onChange={(event => {
                    dispatch({
                        type: "CHANGE_CATEGORY_TITLE", payload: {
                            titlePrev: categoryItem.title,
                            titleNext: event.target.value
                        }
                    });
                })} /></td>
            <td onClick={() => {

                if (categoryItem.matches.length === 0 || (categoryItem.matches.length > 0 && categoryItem.matches[categoryItem.matches.length - 1] !== "")) {

                    dispatch({ type: "ADD_EMPTY_CATEGORY_MATCH", payload: categoryItem.title });
                }
            }}>{categoryItem.matches.map((match, j) => {

                const length = match.length < 4 ? 3 : match.length;
                const width = ((length) * 8) + 'px';
                return <span key={j} className="badge badge-pill badge-secondary ml-1">
                    <input className="bg-transparent border-0 text-white"
                        style={{ width: width }}
                        value={match}
                        onClick={removeLastItemIfEmpty(j, match, categoryItem, dispatch, settings)}
                        onChange={changeValueOfItem(categoryItem, j, dispatch, settings)} />
                    <button type="button"
                        className="btn bg-transparent p-0 m-0 border-0 pl-1"
                        style={{ fontSize: "10px" }}
                        onClick={removeItem(categoryItem, j, dispatch, settings)}>
                        X
                    </button>
                </span>
            })}
            </td>
            <td>
                <button type="button" className="btn btn-danger"
                    onClick={() => {
                        dispatch({ type: 'REMOVE_CATEGORY', payload: categoryItem.title });
                    }}>X</button>
            </td>
        </tr>
    </Draggable>);

    return <div>

        <div className="jumbotron">
            <h1>Costs Categories</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Keys</th>
                    </tr>
                </thead>
                <tbody>
                    {mappedCategories}
                    <tr>
                        <td><button type="button" className="btn btn-secondary w-100"
                            onClick={() => {
                                dispatch({ type: 'ADD_CATEGORY' });
                            }}>Add</button></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>;
}

export default Settings;

function removeItem(categoryItem: CategroyItem, j: number, dispatch: (action: SettingsAction) => void, categoryList: CategoryList): ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined {
    return (event) => {
        event.stopPropagation();
        dispatch({ type: "REMOVE_CATEGORY_MATCH", payload: { title: categoryItem.title, matchIndex: j } });
    };
}

function changeValueOfItem(categoryItem: CategroyItem, j: number, dispatch: (action: SettingsAction) => void, categoryList: CategoryList): ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined {
    return (event) => {
        dispatch({ type: "CHANGE_CATEGORY_MATCH_TEXT", payload: { title: categoryItem.title, matchIndex: j, matchText: event.target.value } });
    };
}

function removeLastItemIfEmpty(j: number, match: string, categoryItem: CategroyItem, dispatch: (action: SettingsAction) => void, categoryList: CategoryList): ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void) | undefined {
    return event => {

        if (j < match.length - 1 && categoryItem.matches[categoryItem.matches.length - 1] === "") {

            const indexLastMatch = categoryItem.matches.length - 1;
            dispatch({ type: "REMOVE_CATEGORY_MATCH", payload: { title: categoryItem.title, matchIndex: indexLastMatch } });
        }

        event.stopPropagation();
    };
}
