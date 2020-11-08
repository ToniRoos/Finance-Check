import * as React from "react";
import DataRow from "../DataRow";
import { AccountData } from "../logic/helper";
import { dataAccountStore } from "../stores/accountDataStore";
import { filterStore } from "../stores/filterStore";

export interface FilterType {
    // isChecked: boolean; 
    key: string;
    value: string;
    // type?: "date" | "number" | "text";
}

export interface FilterState {
    data: FilterType[];
}

const TablePage = () => {

    const { state: dataContext } = React.useContext(dataAccountStore);
    // const { state: filterList, dispatch } = React.useContext(filterStore);
    const filterList: FilterType[] = [
        { key: "BookingDate", value: "Booking Date" },
        { key: "Client", value: "Client" },
        { key: "Creditor", value: "Creditor" },
        { key: "BankAccountNumber", value: "Bank Account Number" },
        { key: "Amount", value: "Amount" }
    ];
    const [searchText, setSearchText] = React.useState("");
    const [accountData, setData] = React.useState<AccountData>({ data: [], bankAccountNumber: "" });

    React.useEffect(() => {

        const listToShow = searchText === "" ? dataContext.data : dataContext.data.filter(row => row.Creditor.toLocaleLowerCase().match(searchText.toLocaleLowerCase()));
        setData({ data: listToShow, bankAccountNumber: dataContext.bankAccountNumber });
    }, [searchText, dataContext]);

    // const filterListMapped = filterList.data.map((item, i) =>
    //     <a key={i} className="dropdown-item bg-dark">
    //         <div className="form-check form-check-inline">
    //             <input className="form-check-input" type="checkbox" id={`inlineCheckbox${i}`}
    //                 checked={item.isChecked}
    //                 onChange={() => {
    //                     dispatch({ type: "TOGGLE_FILTER", payload: item.key });
    //                 }} />
    //             <label className="form-check-label text-light" htmlFor={`inlineCheckbox${i}`}>
    //                 {item.value}
    //             </label>
    //         </div>
    //     </a >
    // );

    const mappedTableHeaders = filterList.map((filterItem, i) => {
        return <th key={i} scope="col" className="align-middle">{filterItem.value}</th>
    })

    const mappedDataList = accountData.data.map((element, index) => <DataRow key={index} {...element} filterList={filterList} />);

    return <div>

        <div className="row d-flex">
            {/* <div className="btn-group dropright">
                <button type="button" className="btn bg-info text-white dropdown-toggle rounded-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Filter
                </button>
                <div className="dropdown-menu bg-dark rounded-0">
                    {filterListMapped}
                </div>
            </div> */}
            <div className="flex-grow-1 ">

            </div>
            <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2 text-info" type="search" placeholder="Search" aria-label="Search"
                    onChange={(event) => setSearchText(event.target.value)}
                />
            </form>
        </div>
        <div className="row">
            <table className="table table-hover table-secondary">
                <thead>
                    <tr className="text-white bg-dark">
                        {mappedTableHeaders}
                    </tr>
                </thead>
                <tbody>
                    {mappedDataList}
                </tbody>
            </table>
        </div>
    </div>
}

export default TablePage;