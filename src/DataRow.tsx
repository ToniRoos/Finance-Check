import * as React from "react";
import DataColumn from "./DataColumn";
import { FilterType } from "./pages/TablePage";

export interface AccountDataRow {
    BookingDate: Date;
    // ValueDate: Date;
    // BookingText: string;
    Client: string;
    // Reason: string;
    BankAccountNumber: string;
    // BankCode: string;

    Creditor: string;
    Amount: number;
    // ClientReference: string;
    // CustomerReference: string;
}

export interface DataRowProps extends AccountDataRow {
    filterList: FilterType[];
}

const DataRow = (props: DataRowProps) => {

    const listToRender = [];
    for (const [key, value] of Object.entries(props)) {

        const filterForPropsFiltered = props.filterList.filter(filterItem => filterItem.key === key);
        if (filterForPropsFiltered.length === 0) {
            continue;
        }

        listToRender.push(<DataColumn key={key} value={value} />);
    }

    return <tr>
        {listToRender}
    </tr >;
}

export default DataRow;