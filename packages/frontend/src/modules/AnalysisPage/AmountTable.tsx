import * as React from "react";
import { AccountDataRow } from "common";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import _ from "lodash";
import Chip from "@mui/material/Chip";
import { parseDate, formatNumberToEuroAmount } from "../../logic/helper";
import { useScrollBottom } from "../../hooks/useScrollBottom";

export interface AmountTableProps {
    data: AccountDataRow[];
}

const AmountTable = (props: AmountTableProps) => {

    const { data: accountData } = props
    const [count, setCount] = React.useState(100)

    const { bottom } = useScrollBottom()
    React.useEffect(() => {
        if (bottom) {
            const nextCount = count + 100
            const dataLength = accountData.length - 1
            console.log('bottom', nextCount, dataLength)
            setCount(Math.min(dataLength, nextCount))
        }
    }, [bottom])

    const partial = accountData.slice(0, count)
    return (
        // <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small" stickyHeader={true}>
            <TableHead>
                <TableRow>
                    <TableCell align="left">Booking Date</TableCell>
                    <TableCell align="left">Client</TableCell>
                    <TableCell align="left">Reason</TableCell>
                    <TableCell align="right">Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody onScroll={(ev) => console.log('scroll')} style={{ height: '500px' }}>
                {
                    _.map(partial, (item, index) => <TableRow key={index}>
                        <TableCell align="left">{item.bookingDate ? parseDate(item.bookingDate) : ''}</TableCell>
                        <TableCell align="left">{item.client}</TableCell>
                        <TableCell align="left">{item.reason}</TableCell>
                        <TableCell color="success" align="right">
                            <Chip label={item.amount ? formatNumberToEuroAmount(item.amount) : 0}
                                color={item.amount < 0 ? 'error' : 'success'}
                                variant="outlined" />
                        </TableCell>
                    </TableRow>)
                }

            </TableBody>
        </Table>
        // </TableContainer>
    )
}

export default AmountTable;