import { useState } from 'react';
import { routeNames, routes, RoutesData } from './routes';

export const useRoutes = () => {
    const [router, setRouter] = useState<RoutesData>({ currentRoute: routeNames.tableRoute, routeList: routes });

    const route = router.routeList.find(route => route.routeName === router.currentRoute) ?? router.routeList[0];
    const to = (route: string) => setRouter(prev => ({ ...prev, currentRoute: route }))

    return {
        route,
        to
    }
}