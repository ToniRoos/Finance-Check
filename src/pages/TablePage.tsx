import * as React from "react";
import BankAccountItem from "../BankAccountItem";
import DropZone from "../DropZone";
import { dataAccountStore } from "../stores/accountDataStore";

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
    const mappedDataAccounts = dataContext.accountList.map((item, i) => <BankAccountItem key={i} {...item} />);
    let saldo = 0;
    dataContext.accountList.forEach(item => {
        saldo += item.saldo as number;
    });
    const style = (saldo as number) < 0 ? "text-right bg-danger" : "text-right bg-success";

    return <div>
        <DropZone />
        {mappedDataAccounts}
        <div className="jumbotron p-4">
            <div className="d-flex">
                <div className="pl-4">
                    <h4>
                        <a className="text-dark">
                            Gesamtsumme
                        </a>
                    </h4>
                </div>
                <div className="flex-grow-1" />
                <div className={style} style={{ width: "150px" }}>
                    <h4>{saldo} €</h4>
                </div>
            </div>
        </div>
    </div>
}

export default TablePage;