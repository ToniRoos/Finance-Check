import * as React from "react";
import { filterStore } from "../stores/filterStore";
import * as fs from "fs";
import Draggable from "react-draggable";
import DropZone from "../DropZone";

const Settings = () => {

    const { state: filterList, dispatch } = React.useContext(filterStore);

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

    return <div>
        <DropZone />

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