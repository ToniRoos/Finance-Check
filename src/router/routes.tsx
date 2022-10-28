import React from "react";
import { Settings } from "@mui/icons-material";
import { AnalysisPage } from "../pages/AnalysisPage";
import ContractsPage from "../pages/ContractsPage";
import OverviewPage from "../pages/OverviewPage";

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