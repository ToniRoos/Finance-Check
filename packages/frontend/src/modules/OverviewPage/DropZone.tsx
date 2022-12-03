import * as React from "react";
import { FetchState } from '../../api/useBankAccounts'
import CircularProgress from "@mui/material/CircularProgress";
import { uploadCsv } from "../../api/api";

export interface DropZoneProps {
    uploaded: () => void
}

const DropZone = (props: DropZoneProps) => {

    const { uploaded } = props
    const [active, setActive] = React.useState(false);
    const [fetchingState, setFetchingState] = React.useState(FetchState.initial);

    const dropHandler = async (ev: React.DragEvent<HTMLDivElement>) => {

        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();

                    if (file !== null && file.type === "text/csv") {
                        setFetchingState(FetchState.loading)

                        const csv = await file.text()
                        uploadCsv({ csv }).then(data => {
                            console.log(data)
                            uploaded()
                        }).catch(err => console.error(err))
                    }
                }
            }
        }
        setActive(false);
    }

    function dragOverHandler(ev: React.DragEvent<HTMLDivElement>) {

        setActive(true);
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    function dragLeaveHandler(ev: React.DragEvent<HTMLDivElement>) {

        setActive(false);
    }

    const style = active ? "text-light border-light bg-success" : "text-secondary border-secondary bg-dark";

    return (
        <div className={`dropZone w-100 h-100 text-center p-2 pt-5 pb-5 d-flex flex-column align-items-center d-flex ${style}`}
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}>
            <div className="flex-fill"></div>
            {fetchingState === FetchState.loading ? <CircularProgress /> : <h2>{"--> Drop CSV file here <--"}</h2>}
            <div className="flex-fill"></div>
        </div>
    )
}

export default DropZone;