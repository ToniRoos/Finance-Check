import * as React from "react";
import { uploadCsv } from "../../api/api";
// import { loadCsv } from "../../logic/dataManager";
import { AccountData } from "../../logic/helper";
import { dataAccountStore } from "../../stores/accountDataStore";
import { useBankAccounts } from '../../api/useBankAccounts'

const DropZone = () => {

    const [filePath, setFilePath] = React.useState("");
    const [active, setActive] = React.useState(false);
    const { dispatch } = React.useContext(dataAccountStore);
    const [accountData, setData] = React.useState<AccountData>({ data: [], bankAccountNumber: "" });
    const { reloadData } = useBankAccounts()

    React.useEffect(() => {

        if (filePath !== "") {
            // loadCsv(filePath, setData);
            setActive(false);
        }
    }, [filePath])

    React.useEffect(() => {

        if (accountData.data.length === 0) {
            return;
        }
        dispatch({ type: "SET_DATA", payload: accountData });

    }, [accountData]);

    const dropHandler = async (ev: React.DragEvent<HTMLDivElement>) => {

        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();

                    if (file !== null && file.type === "text/csv") {
                        // const path = (file as any).path;
                        // setFilePath(path);
                        const csv = await file.text()
                        uploadCsv({ csv }).then(data => {
                            console.log(data)
                            reloadData()
                        }).catch(err => console.error(err))
                    }
                }
            }
        }
    }

    function dragOverHandler(ev: React.DragEvent<HTMLDivElement>) {

        setActive(true);

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    function dragLeaveHandler(ev: React.DragEvent<HTMLDivElement>) {

        setActive(false);
    }

    const style = active ? "text-light border-light bg-info" : "text-secondary border-secondary bg-dark";

    return <div className="row">
        <div className={`dropZone w-100 text-center m-4 p-2 pt-5 pb-5 d-flex flex-column align-items-center ${style}`}
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}>

            <h2>{"--> Drop CSV file here <--"}</h2>
        </div>
    </div>
}

export default DropZone;