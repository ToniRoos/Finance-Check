import React from 'react';
import * as fs from "fs";
import { settingsStore } from '../stores/settingsStore';
import { dataAccountStore } from '../stores/accountDataStore';
import { AccountData, resolveAccountListPath, resolveSettingsPath } from '../logic/helper';
import { toast } from 'react-toastify';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Payment from '@mui/icons-material/Payment';
import { MenuButton } from './MenuButton'
import { useRoutes } from '../router/useRoutes';
import { routeNames } from '../router/routes'

const Main = () => {

    const { dispatch } = React.useContext(dataAccountStore);
    const { route, to } = useRoutes()
    const { analysisRoute, contractsRoute, settingsRoute, tableRoute } = routeNames

    const { state: settings, dispatch: settingsDispatcher } = React.useContext(settingsStore);
    const settingsPath = resolveSettingsPath();
    const accountListPath = resolveAccountListPath();

    React.useEffect(() => {

        if (settings.categories.length === 0) {
            return;
        }

        try {
            let data = JSON.stringify({ categories: settings.categories }, null, 4);
            fs.writeFileSync(settingsPath, data);
        } catch (e) {
            toast.error('Failed to write settings.json');
        }

    }, [route]);

    React.useEffect(() => {

        try {
            if (fs.existsSync(settingsPath)) {
                fs.readFile(settingsPath, (err, data: any) => {
                    if (err) throw err;

                    let settings = JSON.parse(data);
                    settingsDispatcher({ type: "SET_CATEGORIES", payload: settings.categories });
                })
            }

            if (fs.existsSync(accountListPath)) {
                fs.readFile(accountListPath, (err, data: any) => {
                    if (err) throw err;

                    let dataParsed = JSON.parse(data).accountList as AccountData[];
                    dataParsed.forEach(element => {

                        element.data.forEach(item => {
                            item.BookingDate = new Date(item.BookingDate);
                        });
                    });
                    dispatch({ type: "SET_INITAL_DATA", payload: dataParsed });
                })
            }
        } catch (err) {
            console.error(err)
        }
    }, []);

    return <div>
        <AppBar position='sticky'>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <Payment fontSize='large' />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Finance Check
                </Typography>
                <MenuButton isActive={route.routeName === tableRoute} routeName={tableRoute} to={to}>Overview</MenuButton>
                <MenuButton isActive={route.routeName === analysisRoute} routeName={analysisRoute} to={to}>Analysis</MenuButton>
                <MenuButton isActive={route.routeName === contractsRoute} routeName={contractsRoute} to={to}>Contracts</MenuButton>
                <MenuButton isActive={route.routeName === settingsRoute} routeName={settingsRoute} to={to}>Settings</MenuButton>
            </Toolbar>
        </AppBar>
        <div className="container-fluid bg-dark">
            {route.page()}
        </div>
        <div className="text-secondary text-right container-fluid mb-2">
            by Toni Roos
        </div>
    </div>
}

export default Main;

