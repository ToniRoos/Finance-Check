import { useState, useEffect, useContext } from 'react';
import { AccountData, loadCsv } from '../logic/helper';
import { dataAccountStore } from '../stores/accountDataStore';
// import { filterStore } from '../stores/settingsStore';

export function useDataAccountHook(filePath: string) {

    const { dispatch } = useContext(dataAccountStore);
    const [accountData, setData] = useState<AccountData>({ data: [], bankAccountNumber: "" });
    // const { state: filterList } = useContext(filterStore);

    // useEffect(() => {

    //     if (filterList.data.length > 0) {
    //         loadCsv(filePath, setData, filterList);
    //     }
    // }, [filterList])

    useEffect(() => {

        dispatch({ type: "SET_DATA", payload: accountData });

    }, [accountData]);
}