import React from 'react'
// import * as fs from "fs";
import { settingsStore } from '../stores/settingsStore'
import { resolveAccountListPath, resolveSettingsPath } from '../logic/helper'
import { toast } from 'react-toastify'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Payment from '@mui/icons-material/Payment'
import { MenuButton } from './MenuButton'
import { useRoutes } from '../router/useRoutes'
import { routeNames } from '../router/routes'
import { useScrollBottom } from '../hooks/useScrollBottom'

const Main = () => {

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
            // let data = JSON.stringify({ categories: settings.categories }, null, 4);
            // fs.writeFileSync(settingsPath, data);
        } catch (e) {
            toast.error('Failed to write settings.json');
        }

    }, [route]);

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
                <MenuButton isActive={route.routeName === tableRoute} routeName={tableRoute} to={to} >Overview</MenuButton>
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

