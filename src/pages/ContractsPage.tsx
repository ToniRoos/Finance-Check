import * as React from "react";
import DataColumn from "../DataColumn";
import { AccountDataRow } from "../DataRow";
import { AccountData, formatNumberToEuroAmount, trim } from "../logic/helper";
import { dataAccountStore } from "../stores/accountDataStore";

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
            const client = element.Client;

            if (client === "") {
                return;
            }

            const dataForClient = getDataFiltered(dataContext, element);
            const sameData = dataForClient.length;
            const amountForClient = dataForClient[0].Amount;
            const countSameAmountsForClient = dataForClient.filter(item => item.Amount === amountForClient).length;

            if (sameData > 2 && countSameAmountsForClient > 1) {
                if (!contracts.includes(client)) {
                    contracts.push(client);
                }

                if (contracts2.filter(item => checkCreditorOrClient(item, element) || item.BankAccountNumber === element.BankAccountNumber).length === 0) {
                    contracts2.push(element);
                }
            }
        });
    }

    const contractsMonthly: ContractData[] = [];
    const contractsQuarterly: ContractData[] = [];
    const contractsYearly: ContractData[] = [];

    contracts2.forEach(element => {

        const dataForCLient = getDataFiltered(dataContext, element);
        const values = dataForCLient.map(item => item.Amount);

        const diffOfBookingInMonths = dataForCLient[0].BookingDate.getMonth() - dataForCLient[1].BookingDate.getMonth();

        if (diffOfBookingInMonths === 1 || diffOfBookingInMonths === -11) {
            contractsMonthly.push({
                Client: element.Client,
                // Reason: dataForCLient[0].Reason, 
                lastValue: values[0]
            });
        }
        if (diffOfBookingInMonths === 3) {
            contractsQuarterly.push({
                Client: element.Client,
                //  Reason: dataForCLient[0].Reason, 
                lastValue: values[0]
            });
        }
        if (diffOfBookingInMonths === 12) {
            contractsYearly.push({
                Client: element.Client,
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

function getDataFiltered(dataContext: AccountData, element: AccountDataRow) {
    return dataContext.data.filter(item => checkCreditorOrClient(item, element) || item.BankAccountNumber === element.BankAccountNumber);
}

function checkCreditorOrClient(item: AccountDataRow, element: AccountDataRow): unknown {

    if (item.Creditor === "") {
        return trim(item.Client) === trim(element.Client);
    }
    return trim(item.Creditor) === trim(element.Creditor);
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