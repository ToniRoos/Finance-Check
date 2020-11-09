import * as React from "react";
import { filterStore } from "../stores/filterStore";
import * as fs from "fs";
import Draggable from "react-draggable";

interface CategroyItem {
    title: string;
    matches: string[];
}

interface CategoryList {
    categories: CategroyItem[];
}

const Settings = () => {

    const { state: filterList, dispatch } = React.useContext(filterStore);
    const [categoryList, setCategoryList] = React.useState<CategoryList>({
        categories: [
            { title: "Shopping", matches: ["rewe", "edeka", "amazon"] }
        ]
    })

    const filterListMapped = filterList.data.map((item, i) => <Draggable key={i} axis="y" position={{ x: 0, y: 0 }} onStop={(event, data) => {

        const height = data.node.clientHeight;
        const transY = data.lastY;

        const elementsToMove = parseInt((transY / height) + "");
        const diff = i + elementsToMove;

        dispatch({ type: "MOVE_FILTER_ITEM", payload: { filterKey: item.key, position: diff } });

    }}>
        <tr>
            <td className="col">
                <input type="text"
                    aria-label="Last name"
                    className="form-control"
                    value={item.value}
                    onChange={(event) => {
                        dispatch({
                            type: 'SET_FILTERITEM_TEXT', payload: {
                                filterKey: item.key,
                                filterName: event.target.value
                            }
                        })
                    }} />
            </td>
            <td className="col">
                <select className="form-control" style={{ width: "120px" }}
                    //  value={item.type}
                    onChange={(event) => {
                        dispatch({
                            type: 'SET_FILTERITEM_TYPE', payload: {
                                filterKey: item.key,
                                filtertype: event.target.value
                            }
                        })
                    }}>
                    <option value="text">text</option>
                    <option value="date">date</option>
                    <option value="number">number</option>
                </select>
            </td>
            <td>
                <button type="button" className="btn btn-danger"
                    onClick={() => {
                        dispatch({ type: 'REMOVE_FILTERITEM', payload: item.key });
                    }}>X</button>
            </td>

        </tr>
    </Draggable>);

    const mappedCategories = categoryList.categories.map((categoryItem, i) => <tr key={i}>
        <td>{categoryItem.title}</td>
        <td onClick={() => {

            if (categoryItem.matches.length > 0 && categoryItem.matches[categoryItem.matches.length - 1] !== "") {
                categoryItem.matches.push("");
                setCategoryList({ categories: categoryList.categories });
            }
        }}>{categoryItem.matches.map((match, j) => {
            const width = ((match.length) * 8) + 'px';
            return <span key={j} className="badge badge-pill badge-secondary ml-1">
                <input className="bg-transparent border-0 text-white"
                    style={{ width: width }}
                    value={match}
                    onClick={removeLastItemIfEmpty(j, match, categoryItem, setCategoryList, categoryList)}
                    onChange={changeValueOfItem(categoryItem, j, setCategoryList, categoryList)} />
                <button type="button"
                    className="btn bg-transparent p-0 m-0 border-0 pl-1"
                    style={{ fontSize: "10px" }}
                    onClick={removeItem(categoryItem, j, setCategoryList, categoryList)}>
                    X
                </button>
            </span>
        })}
        </td>
    </tr>);

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
                    {/* <tr>
                        <td><button type="button" className="btn btn-secondary w-100"
                            onClick={() => {
                                dispatch({ type: 'ADD_FILTERITEM' });
                            }}>Add</button></td>
                        <td></td>
                        <td></td>
                    </tr> */}
                </tbody>
            </table>
        </div>

        <div className="jumbotron">
            <h1>Title</h1>
            <table className="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col">Column Name</th>
                        <th scope="col">Column Type</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {filterListMapped}
                    <tr>
                        <td><button type="button" className="btn btn-secondary w-100"
                            onClick={() => {
                                dispatch({ type: 'ADD_FILTERITEM' });
                            }}>Add</button></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="row mt-2 border-top pt-2 mb-2">
            <div className="col">
                <button type="button" className="btn btn-info w-100"
                    onClick={() => {
                        let data = JSON.stringify({ filter: filterList.data }, null, 4);
                        fs.writeFileSync('settings.json', data);
                    }}>Save</button>
            </div>
        </div>
    </div>;
}

export default Settings;

function removeItem(categoryItem: CategroyItem, j: number, setCategoryList: React.Dispatch<React.SetStateAction<CategoryList>>, categoryList: CategoryList): ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined {
    return (event) => {
        event.stopPropagation();
        categoryItem.matches.splice(j, 1);
        setCategoryList({ categories: categoryList.categories });
    };
}

function changeValueOfItem(categoryItem: CategroyItem, j: number, setCategoryList: React.Dispatch<React.SetStateAction<CategoryList>>, categoryList: CategoryList): ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined {
    return (event) => {
        categoryItem.matches[j] = event.target.value;
        setCategoryList({ categories: categoryList.categories });
    };
}

function removeLastItemIfEmpty(j: number, match: string, categoryItem: CategroyItem, setCategoryList: React.Dispatch<React.SetStateAction<CategoryList>>, categoryList: CategoryList): ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void) | undefined {
    return event => {

        if (j < match.length - 1 && categoryItem.matches[categoryItem.matches.length - 1] === "") {
            categoryItem.matches.pop();
            setCategoryList({ categories: categoryList.categories });
        }

        event.stopPropagation();
    };
}
