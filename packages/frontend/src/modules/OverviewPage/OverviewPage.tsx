import * as React from "react";
import BankAccountItem from "./BankAccountItem";
import DropZone from "./DropZone";
import { formatNumberToEuroAmount } from "../../logic/helper";
import { useBankAccounts } from "../../api/useBankAccounts";

export interface FilterType {
    // isChecked: boolean; 
    key: string;
    value: string;
    // type?: "date" | "number" | "text";
}

export interface FilterState {
    data: FilterType[];
}

const OverviewPage = () => {

    // const { state: dataContext } = React.useContext(dataAccountStore)
    const { state, bankAccounts } = useBankAccounts({ immediate: true })
    console.log('useBankAccounts', state)

    const mappedDataAccounts = bankAccounts.map((item, i) => <BankAccountItem key={i} {...item} />);
    let saldo = 0;

    bankAccounts.forEach(item => {
        saldo += item.saldo as number;
    });
    const style = (saldo as number) < 0 ? "text-right text-danger" : "text-right text-dark";

    return <div>
        <DropZone />
        {mappedDataAccounts}
        <div className="jumbotron p-4">
            <div className="d-flex align-items-center">
                <div className="pl-4">
                    <h4 className="m-0">
                        <a className="text-dark">
                            Gesamtsumme
                        </a>
                    </h4>
                </div>
                <div className="flex-grow-1" />
                <div className={style}>
                    <h4 className="m-0 p-2">{formatNumberToEuroAmount(saldo)}</h4>
                </div>
            </div>
        </div>
    </div>
}

export default OverviewPage;