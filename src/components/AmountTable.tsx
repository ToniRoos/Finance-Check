import * as React from "react";
import { FilterType } from "../pages/OverviewPage";
import DataRow, { AccountDataRow } from "./DataRow";

export interface AmountTableProps {
    data: AccountDataRow[];
}

const AmountTable = (props: AmountTableProps) => {

    const filterList: FilterType[] = [
        { key: "BookingDate", value: "Booking Date" },
        { key: "Client", value: "Client" },
        // { key: "Creditor", value: "Creditor" },
        // { key: "BankAccountNumber", value: "Bank Account Number" },
        { key: "Amount", value: "Amount" }
    ];

    const mappedTableHeaders = filterList.map((filterItem, i) => {
        return <th key={i} scope="col" className="align-middle bg-dark border-0">{filterItem.value}</th>
    })

    const mappedDataList = props.data.map((element, index) => <DataRow key={index} {...element} filterList={filterList} />);

    return <div className="tableFixHead">
        <table className="table table-hover">
            <thead>
                <tr className="text-white">
                    {mappedTableHeaders}
                </tr>
            </thead>
            <tbody>
                {mappedDataList}
            </tbody>
        </table>
    </div>
}

export default AmountTable;