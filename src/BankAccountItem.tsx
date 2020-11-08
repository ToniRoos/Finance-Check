import * as React from "react";
import DataRow, { AccountDataRow } from "./DataRow";
import { AccountData, trim } from "./logic/helper";
import { FilterType } from "./pages/TablePage";
// const dkbIcon = require('./images/dkb_icon.png');
import logo from './images/dkb_icon.png';

const BankAccountItem = (props: AccountData) => {

    const [searchText, setSearchText] = React.useState("");
    const [accountData, setData] = React.useState<AccountDataRow[]>(props.data);

    const filterList: FilterType[] = [
        { key: "BookingDate", value: "Booking Date" },
        { key: "Client", value: "Client" },
        // { key: "Creditor", value: "Creditor" },
        // { key: "BankAccountNumber", value: "Bank Account Number" },
        { key: "Amount", value: "Amount" }
    ];

    React.useEffect(() => {

        const listToShow = searchText === "" ? props.data : props.data.filter(row => row.Client.toLocaleLowerCase().match(searchText.toLocaleLowerCase()));
        setData(listToShow);
    }, [searchText]);

    const mappedTableHeaders = filterList.map((filterItem, i) => {
        return <th key={i} scope="col" className="align-middle">{filterItem.value}</th>
    })

    const mappedDataList = accountData.map((element, index) => <DataRow key={index} {...element} filterList={filterList} />);
    const id = `collapseItem${trim(props.bankAccountNumber.replace(/\/|\*/g, ''))}`;
    const style = (props.saldo as number) < 0 ? "text-right bg-danger" : "text-right bg-success";

    return <div className="jumbotron p-4">

        <div className="d-flex">
            <div>
                {<img src={logo} alt="Logo" style={{ width: "50px" }} />}
            </div>
            <div className="pl-4">
                <h4>
                    <a className="text-dark" data-toggle="collapse" href={`#${id}`} role="button" aria-expanded="false" aria-controls={`${id}`} >
                        {props.bankAccountNumber}
                    </a>
                </h4>
            </div>
            <div className="flex-grow-1" />
            <div className={style} style={{ width: "150px" }}>
                <h4>{props.saldo} €</h4>
            </div>

        </div>

        <div id={`${id}`} className="collapse overflow-auto bankAccountItem">

            <hr className="my-4" />
            <div className="row d-flex">
                <div className="flex-grow-1">
                </div>
                <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2 text-info" type="search" placeholder="Search" aria-label="Search"
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </form>
            </div>
            <table className="table table-hover" style={{ height: "400px !important" }}>
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
    </div>;
}

export default BankAccountItem;