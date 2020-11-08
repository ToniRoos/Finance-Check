import * as React from "react";
import { AccountData, loadCsv } from "./logic/helper";
import { dataAccountStore } from "./stores/accountDataStore";
import { filterStore } from "./stores/filterStore";

const DropZone = () => {

    const [filePath, setFilePath] = React.useState("");
    const { state: filterList } = React.useContext(filterStore);
    const { dispatch } = React.useContext(dataAccountStore);
    const [accountData, setData] = React.useState<AccountData>({ data: [], bankAccountNumber: "" });

    React.useEffect(() => {

        if (filterList.data.length > 0 && filePath !== "") {
            loadCsv(filePath, setData, filterList);
        }
    }, [filterList, filePath])

    React.useEffect(() => {

        if (accountData.data.length === 0) {
            return;
        }
        dispatch({ type: "SET_DATA", payload: accountData.data });

    }, [accountData]);

    const dropHandler = (ev: React.DragEvent<HTMLDivElement>) => {

        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();

                    if (file !== null) {
                        console.log('... file[' + i + '].name = ' + file.name);
                        const path = (file as any).path;
                        setFilePath(path);
                    }
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);

            }
        }
    }

    function dragOverHandler(ev: React.DragEvent<HTMLDivElement>) {
        console.log('File(s) in drop zone');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    return <div className="row">
        <div id="drop_zone" className="w-100 text-center m-4 p-2 pt-5 pb-5 d-flex text-white flex-column align-items-center" onDrop={dropHandler} onDragOver={dragOverHandler}>

            <h2>Drag one or more CSV files to this<br />drop zone to add bank account data...</h2>
        </div>
    </div>
}

export default DropZone;