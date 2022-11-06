import * as React from "react";
import DataColumn from "./DataColumn";
import { FilterType } from "../modules/OverviewPage/OverviewPage";
import { CategroyItem } from "../modules/SettingsPage/SettingsPage";
import { settingsStore } from "../stores/settingsStore";
import { AccountDataRow } from 'common'

// export interface AccountDataRow {
//     BookingDate: Date;
//     // ValueDate: Date;
//     // BookingText: string;
//     Client: string;
//     Reason: string;
//     BankAccountNumber: string;
//     // BankCode: string;

//     Creditor: string;
//     Amount: number;
//     // ClientReference: string;
//     // CustomerReference: string;
// }

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

    const client = checkClientMapping(props.client, settings.categories);

    return <tr>
        {/* {listToRender} */}
        <DataColumn value={props.bookingDate} />
        <DataColumn value={checkReason(props.reason) ? `${client} - ${props.reason}` : client} />
        <DataColumn value={props.amount} />
    </tr >;
}

function checkClientMapping(client: string, categoryList: CategroyItem[]) {

    let matchedClientMapping: string | undefined = undefined;
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