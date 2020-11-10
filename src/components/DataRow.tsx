import * as React from "react";
import DataColumn from "./DataColumn";
import { FilterType } from "../pages/OverviewPage";
import { CategroyItem } from "../pages/SettingsPage";
import { settingsStore } from "../stores/settingsStore";

export interface AccountDataRow {
    BookingDate: Date;
    // ValueDate: Date;
    // BookingText: string;
    Client: string;
    Reason: string;
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

    const { state: settings } = React.useContext(settingsStore);

    // const listToRender = [];
    // for (const [key, value] of Object.entries(props)) {

    //     const filterForPropsFiltered = props.filterList.filter(filterItem => filterItem.key === key);
    //     if (filterForPropsFiltered.length === 0) {
    //         continue;
    //     }

    //     listToRender.push(<DataColumn key={key} value={value} />);
    // }

    const client = checkClientMapping(props.Client, settings.categories);

    return <tr>
        {/* {listToRender} */}
        <DataColumn value={props.BookingDate} />
        <DataColumn value={checkReason(props.Reason) ? `${client} - ${props.Reason}` : client} />
        <DataColumn value={props.Amount} />
    </tr >;
}

const paypal = "PayPal";
function checkClientMapping(client: string, categoryList: CategroyItem[]) {

    if (client.toLocaleLowerCase().includes(paypal.toLocaleLowerCase())) {
        return paypal;
    }

    let matchedClientMapping = undefined;
    categoryList.forEach(item => item.matches.forEach(match => {
        if (client.toLocaleLowerCase().includes(match.toLocaleLowerCase())) {
            matchedClientMapping = match;
        }
    }));
    return matchedClientMapping
        ? matchedClientMapping
        : client;
}

function checkReason(reason: string) {

    return reason !== undefined && reason !== "Ja" && reason !== "Nein";

}

export default DataRow;