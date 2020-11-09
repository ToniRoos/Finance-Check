import * as React from 'react';
import { AnalysisPage } from '../pages/AnalysisPage';
import Settings from '../pages/SettingsPage';
import OverviewPage from '../pages/OverviewPage';
import * as fs from "fs";
import { filterStore } from '../stores/filterStore';
import ContractsPage from '../pages/ContractsPage';
import { accountListPath } from '../types';
import { dataAccountStore } from '../stores/accountDataStore';
import { AccountData } from '../logic/helper';

export interface RouteItem { page: () => JSX.Element, routeName: string }

export interface RoutesData {
    routeList: RouteItem[];
    currentRoute: string;
}

const tableRoute = "tableRoute";
const analysisRoute = "analysisRoute";
const contractsRoute = "contractsRoute";
const settingsRoute = "settingsRoute";

const routes: RouteItem[] = [
    {
        routeName: tableRoute,
        page: () => <OverviewPage />
    },
    {
        routeName: analysisRoute,
        page: () => <AnalysisPage />
    },
    {
        routeName: contractsRoute,
        page: () => <ContractsPage />
    },
    {
        routeName: settingsRoute,
        page: () => <Settings />
    }
]

const Main = () => {

    const { dispatch } = React.useContext(dataAccountStore);
    const [router, setRouter] = React.useState<RoutesData>({ currentRoute: tableRoute, routeList: routes });
    const { dispatch: filterDispatcher } = React.useContext(filterStore);

    React.useEffect(() => {

        try {
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

        fs.readFile("settings.json", (err, data: any) => {
            if (err) throw err;

            let settings = JSON.parse(data);
            filterDispatcher({ type: "SET_FILTERLIST", payload: settings.filter });
        })
    }, []);

    const route = router.routeList.filter(route => route.routeName === router.currentRoute)[0];

    return <div>
        <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
            <a className="navbar-brand text-info" href="#">Finance Check</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className={`nav-item${isActive(route, tableRoute)}`}>
                        <a className="nav-link" href="#"
                            onClick={() => setRouter({ currentRoute: tableRoute, routeList: router.routeList })}>
                            Overview
                        </a>
                    </li>
                    <li className={`nav-item${isActive(route, analysisRoute)}`}>
                        <a className="nav-link" href="#"
                            onClick={() => setRouter({ currentRoute: analysisRoute, routeList: router.routeList })}>
                            Chart
                        </a>
                    </li>
                    <li className={`nav-item${isActive(route, contractsRoute)}`}>
                        <a className="nav-link" href="#"
                            onClick={() => setRouter({ currentRoute: contractsRoute, routeList: router.routeList })}>
                            Contracts
                        </a>
                    </li>
                    <li className={`nav-item${isActive(route, settingsRoute)}`}>
                        <a className="nav-link" href="#"
                            onClick={() => setRouter({ currentRoute: settingsRoute, routeList: router.routeList })}>
                            Settings
                            </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div className="container-fluid bg-dark">
            {route.page()}
        </div>
    </div>
}

export default Main;

function isActive(route: RouteItem, routeShouldMatch: string) {
    return route.routeName === routeShouldMatch ? ' active' : '';
}
