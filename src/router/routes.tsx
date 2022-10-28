import React from "react";
import { Settings } from "@mui/icons-material";
import { AnalysisPage } from "../modules/AnalysisPage/AnalysisPage";
import ContractsPage from "../modules/ContractsPage/ContractsPage";
import OverviewPage from "../modules/OverviewPage/OverviewPage";

export interface RouteItem { page: () => JSX.Element, routeName: string }

export interface RoutesData {
    routeList: RouteItem[];
    currentRoute: string;
}

const tableRoute = "tableRoute";
const analysisRoute = "analysisRoute";
const contractsRoute = "contractsRoute";
const settingsRoute = "settingsRoute";

export const routeNames = {
    tableRoute,
    analysisRoute,
    contractsRoute,
    settingsRoute,
}

export const routes: RouteItem[] = [
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