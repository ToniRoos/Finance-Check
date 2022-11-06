import { useState, useEffect, useContext } from 'react';
import { AccountData } from '../logic/helper';
import { dataAccountStore } from '../stores/accountDataStore';

export function useDataAccountHook() {

    const { dispatch } = useContext(dataAccountStore);
    const [accountData] = useState<AccountData>({ data: [], bankAccountNumber: "" });

    useEffect(() => {

        dispatch({ type: "SET_DATA", payload: accountData });

    }, [accountData]);
}