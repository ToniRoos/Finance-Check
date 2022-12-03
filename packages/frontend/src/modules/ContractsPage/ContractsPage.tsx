import * as React from "react";
import DataColumn from "../../components/DataColumn";
import { AccountDataRow } from "common";
import { trim } from "../../logic/helper";
import { dataAccountStore } from "../../stores/accountDataStore";
import { useBankAccountStore } from "../../stores/accountDataStore2";
import _ from "lodash";

interface ContractData {

    Client: string;
    // Reason: string;
    lastValue: number;
}

enum SelectedContracts {
    Monthly,
    Quarterly,
    Yearly
}

interface HeatMapItem {
    day: number
    month: number
    year: number
    date: Date
    amount: number
}

const ContractsPage = () => {

    // const { state: dataContext } = React.useContext(dataAccountStore);
    const { overallData: data } = useBankAccountStore()
    const [selectedContracts, setSelectedContracts] = React.useState<SelectedContracts>(SelectedContracts.Monthly)
    const contracts: string[] = [];
    const contracts2: AccountDataRow[] = [];
    const clientHeatMap: { [client: string]: HeatMapItem[] } = {}

    _.forEach(data, element => {
        const client = element.client;

        if (client === "") {
            return;
        }

        if (!clientHeatMap[client]) {
            clientHeatMap[client] = []
        }
        const day = element.bookingDate.getDate()
        const month = element.bookingDate.getMonth()
        const year = element.bookingDate.getFullYear()
        const some = _.some(clientHeatMap[client], item => item.day === day && item.month === month && item.year === year)

        if (some) {
            return
        }

        clientHeatMap[client].push({
            day,
            month,
            year,
            date: element.bookingDate,
            amount: element.amount
        })

        // const dataForClient = getDataFiltered(data, element);
        // const sameData = dataForClient.length;
        // const amountForClient = dataForClient[0].amount;
        // const countSameAmountsForClient = dataForClient.filter(item => item.amount === amountForClient).length;

        // if (sameData > 2 && countSameAmountsForClient > 1) {
        //     if (!contracts.includes(client)) {
        //         contracts.push(client);
        //     }

        //     if (contracts2.filter(item => checkCreditorOrClient(item, element) || item.bankAccountNumber === element.bankAccountNumber).length === 0) {
        //         contracts2.push(element);
        //     }
        // }
    })
    const contractsMonthly: ContractData[] = [];

    for (const [client, val] of _.entries(clientHeatMap)) {
        const length = val.length
        if (length > 5) {// && Math.abs(max - min) < 5) {
            const sorted = val.sort((a, b) => a.day - b.day)
            const sortedByDate = val.sort((a, b) => a.date.getTime() - b.date.getTime())

            const midIndex = Math.floor(length / 2)
            const { day: midDay } = sorted[midIndex]
            const usg = midDay - 2
            const osg = midDay + 2
            const part = 1 / (length - 1)
            const sum = _.sum(_.map(sorted, val => Math.pow(val.day - midDay, 2)))
            const simga = Math.sqrt(part * sum)
            const cpk = Math.min(midDay - usg, osg - midDay) / (3 * simga)
            const first = sortedByDate.pop()
            if (first && cpk > 0.11 && Date.now() - first?.date.getTime() < 1000 * 60 * 60 * 24 * 400) {
                console.log(client, sorted, midDay, cpk, first.day, first.month, first.year)


                contractsMonthly.push({
                    Client: client,
                    // Reason: dataForCLient[0].Reason, 
                    lastValue: val[0].amount
                });
            }
        }
    }

    // const contractsMonthly: ContractData[] = [];
    const contractsQuarterly: ContractData[] = [];
    const contractsYearly: ContractData[] = [];

    // contracts2.forEach(element => {

    //     const dataForCLient = getDataFiltered(data, element);
    //     const values = dataForCLient.map(item => item.amount);

    //     const diffOfBookingInMonths = dataForCLient[0].bookingDate.getMonth() - dataForCLient[1].bookingDate.getMonth();

    //     if (diffOfBookingInMonths === 1 || diffOfBookingInMonths === -11) {
    //         contractsMonthly.push({
    //             Client: element.client,
    //             // Reason: dataForCLient[0].Reason, 
    //             lastValue: values[0]
    //         });
    //     }
    //     if (diffOfBookingInMonths === 3) {
    //         contractsQuarterly.push({
    //             Client: element.client,
    //             //  Reason: dataForCLient[0].Reason, 
    //             lastValue: values[0]
    //         });
    //     }
    //     if (diffOfBookingInMonths === 12) {
    //         contractsYearly.push({
    //             Client: element.client,
    //             //  Reason: dataForCLient[0].Reason, 
    //             lastValue: values[0]
    //         });
    //     }
    // });

    let contractFiltered = contractsMonthly;
    if (selectedContracts === SelectedContracts.Quarterly) {
        contractFiltered = contractsQuarterly;
    } else if (selectedContracts === SelectedContracts.Yearly) {
        contractFiltered = contractsYearly;
    }

    const contractList = contractFiltered.sort(compare).map((contract, i) => <tr key={i}>
        <td>{contract.Client}</td>
        {/* <td>{contract.Reason}</td> */}
        <DataColumn value={contract.lastValue} />
        {/* <td className={"text-right " + (contract.lastValue < 0 ? "text-danger" : "text-success")}>
            {formatNumberToEuroAmount(Math.abs(contract.lastValue))}
        </td> */}
    </tr>)

    const activeStyleButton = "nav-link text-white bg-info rounded-0";
    const defaultStyleButton = "nav-link text-white";

    return <div className="row">
        <ul className="nav">
            <li className="nav-item">
                <a className={selectedContracts === SelectedContracts.Monthly ? activeStyleButton : defaultStyleButton} href="#"
                    onClick={() => setSelectedContracts(SelectedContracts.Monthly)}>
                    Monthly <span className="badge badge-secondary">{contractsMonthly.length}</span>
                </a>
            </li>
            <li className="nav-item">
                <a className={selectedContracts === SelectedContracts.Quarterly ? activeStyleButton : defaultStyleButton} href="#"
                    onClick={() => setSelectedContracts(SelectedContracts.Quarterly)}>
                    Quarterly <span className="badge badge-secondary">{contractsQuarterly.length}</span>
                </a>
            </li>
            <li className="nav-item">
                <a className={selectedContracts === SelectedContracts.Yearly ? activeStyleButton : defaultStyleButton} href="#"
                    onClick={() => setSelectedContracts(SelectedContracts.Yearly)}>
                    Yearly <span className="badge badge-secondary">{contractsYearly.length}</span>
                </a>
            </li>
        </ul>
        <table className="table table-striped table-hover table-secondary">
            <thead>
                <tr className="text-white bg-dark">
                    <th scope="col">Client</th>
                    {/* <th scope="col">Reason</th> */}
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {contractList}
            </tbody>
        </table>
    </div>
}

function getDataFiltered(accountData: AccountDataRow[], element: AccountDataRow) {
    return accountData.filter(item => checkCreditorOrClient(item, element) || item.bankAccountNumber === element.bankAccountNumber);
}

function checkCreditorOrClient(item: AccountDataRow, element: AccountDataRow): unknown {
    return trim(item.client) === trim(element.client)
        || trim(item.creditor) === trim(element.creditor);
}

function compare(a: ContractData, b: ContractData) {
    if (a.lastValue < b.lastValue) {
        return -1;
    }
    if (a.lastValue > b.lastValue) {
        return 1;
    }
    return 0;
}

export default ContractsPage;