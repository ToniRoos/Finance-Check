import * as React from "react";
import BankAccountItem from "./BankAccountItem";
import DropZone from "./DropZone";
import { formatNumberToEuroAmount } from "../../logic/helper";
import { useBankAccountStore } from "../../stores/accountDataStore2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import _ from "lodash";
import { FetchState } from "../../api/useBankAccounts";
import Skeleton from "@mui/material/Skeleton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';

const OverviewPage = () => {

    const { bankAccounts, reloadData, state } = useBankAccountStore(true)
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let saldo = 0;

    bankAccounts.forEach(item => {
        saldo += item.saldo ?? 0;
    });

    const style = saldo < 0 ? "text-right text-danger" : "text-right text-dark";

    const actions = [
        { icon: <UploadFileOutlined />, name: 'Upload', func: handleClickOpen },
    ];

    return (
        <Box mt={2}>
            <Dialog
                fullScreen
                open={open} onClose={handleClose}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Load CSV
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DropZone uploaded={(() => {
                    reloadData()
                    setOpen(false)
                })} />

            </Dialog>
            <div style={{ marginBottom: '85px' }}>
                {
                    state === FetchState.loading
                        ? <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" height={85} />
                        : _.map(bankAccounts, (item, i) => <BankAccountItem key={i} {...item} />)
                }
            </div>
            {
                state === FetchState.loading
                    ? <Skeleton sx={{ bgcolor: 'grey.300' }} variant="rounded" height={85} />
                    : <Box className="fixed-bottom m-3">
                        <Card sx={{ minWidth: 275, boxShadow: 5 }}>
                            <CardContent>
                                <div className="d-flex align-items-center">
                                    <div className="pl-4">
                                        <h4 className="m-0">
                                            <a>
                                                Gesamtsumme
                                            </a>
                                        </h4>
                                    </div>
                                    <div className="flex-grow-1" />
                                    <div className={style}>
                                        <h4 className="m-0 p-2">{formatNumberToEuroAmount(saldo)}</h4>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Box>}
            <SpeedDial
                style={{ position: 'fixed' }}
                ariaLabel="SpeedDial basic example"
                className="mb-3"
                sx={{ position: 'absolute', bottom: 16, textAlign: 'center', width: '100%' }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.func}
                    />
                ))}
            </SpeedDial>
        </Box >
    )
}

export default OverviewPage;