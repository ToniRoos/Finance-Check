import * as React from "react";
import DataColumn from "../../components/DataColumn";
import { AccountDataRow } from "common";
import { trim } from "../../logic/helper";
import { dataAccountStore } from "../../stores/accountDataStore";

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

const ContractsPage = () => {

    const { state: dataContext } = React.useContext(dataAccountStore);
    const [selectedContracts, setSelectedContracts] = React.useState<SelectedContracts>(SelectedContracts.Monthly)
    const contracts: string[] = [];
    const contracts2: AccountDataRow[] = [];

    if (dataContext.data.length > 0) {

        dataContext.data.forEach(element => {
            const client = element.client;

            if (client === "") {
                return;
            }

            const dataForClient = getDataFiltered(dataContext.data, element);
            const sameData = dataForClient.length;
            const amountForClient = dataForClient[0].amount;
            const countSameAmountsForClient = dataForClient.filter(item => item.amount === amountForClient).length;

            if (sameData > 2 && countSameAmountsForClient > 1) {
                if (!contracts.includes(client)) {
                    contracts.push(client);
                }

                if (contracts2.filter(item => checkCreditorOrClient(item, element) || item.bankAccountNumber === element.bankAccountNumber).length === 0) {
                    contracts2.push(element);
                }
            }
        });
    }

    const contractsMonthly: ContractData[] = [];
    const contractsQuarterly: ContractData[] = [];
    const contractsYearly: ContractData[] = [];

    contracts2.forEach(element => {

        const dataForCLient = getDataFiltered(dataContext.data, element);
        const values = dataForCLient.map(item => item.amount);

        const diffOfBookingInMonths = dataForCLient[0].bookingDate.getMonth() - dataForCLient[1].bookingDate.getMonth();

        if (diffOfBookingInMonths === 1 || diffOfBookingInMonths === -11) {
            contractsMonthly.push({
                Client: element.client,
                // Reason: dataForCLient[0].Reason, 
                lastValue: values[0]
            });
        }
        if (diffOfBookingInMonths === 3) {
            contractsQuarterly.push({
                Client: element.client,
                //  Reason: dataForCLient[0].Reason, 
                lastValue: values[0]
            });
        }
        if (diffOfBookingInMonths === 12) {
            contractsYearly.push({
                Client: element.client,
                //  Reason: dataForCLient[0].Reason, 
                lastValue: values[0]
            });
        }
    });

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

    if (item.creditor === "") {
        return trim(item.client) === trim(element.client);
    }
    return trim(item.creditor) === trim(element.creditor);
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