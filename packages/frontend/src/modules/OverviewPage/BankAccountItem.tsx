import * as React from "react";
import { AccountDataRow } from "common";
import { AccountData, formatNumberToEuroAmount, trim } from "../../logic/helper";
import logo from '../../images/dkb_icon.png';
import AmountTable from "../AnalysisPage/AmountTable";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Paper from '@mui/material/Paper';

const BankAccountItem = (props: AccountData) => {

    const [searchText, setSearchText] = React.useState("");
    const [accountData, setData] = React.useState<AccountDataRow[]>(props.data);

    React.useEffect(() => {
        const listToShow = searchText === "" ? props.data : props.data.filter(row => row.client.toLocaleLowerCase().match(searchText.toLocaleLowerCase())
            || row.reason.toLocaleLowerCase().match(searchText.toLocaleLowerCase())
            || row.creditor.toLocaleLowerCase().match(searchText.toLocaleLowerCase())
            || matchesAmount(row));
        setData(listToShow);

        function matchesAmount(row: AccountDataRow): unknown {
            return row.amount.toFixed(2).match(searchText.toLocaleLowerCase());
        }
    }, [searchText]);

    const id = `collapseItem${trim(props.bankAccountNumber.replace(/\/|\*/g, ''))}`;
    const style = (props.saldo as number) < 0 ? "text-right text-danger" : "text-right text-dark";

    return <div className="jumbotron p-4">

        <div className="d-flex align-items-center">
            <div>
                {<img src={logo} alt="Logo" style={{ width: "50px" }} />}
            </div>
            <div className="pl-4">
                <h4 className="m-0">
                    <a className="text-dark" data-toggle="collapse" href={`#${id}`} role="button" aria-expanded="false" aria-controls={`${id}`} >
                        {props.bankAccountNumber}
                    </a>
                </h4>
            </div>
            <div className="flex-grow-1" />
            <div className={style}>
                <h4 className="p-2 m-0">{props.saldo ? formatNumberToEuroAmount(props.saldo) : 0}</h4>
            </div>
        </div>

        <div id={`${id}`} className="collapse overflow-auto">

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
            <AmountTable data={accountData} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Booking Date</TableCell>
                            <TableCell align="right">Client</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {accountData.map((row) => (
                            <TableRow
                                key={`${row.BookingDate}-${row.Amount}`}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{row.BookingDate}</TableCell>
                                <TableCell align="right">{row.Client}</TableCell>
                                <TableCell align="right">{row.Amount}</TableCell>
                            </TableRow>
                        ))} */}
                        <TableRow>
                            <TableCell align="right">22.02.2022</TableCell>
                            <TableCell align="right">dasmdasm</TableCell>
                            <TableCell align="right">22.22 €</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>;
}

export default BankAccountItem;