import { AccountData, AccountDataRow } from "common";
import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { FetchState, useBankAccounts } from "../api/useBankAccounts";
import { calcualateOverallAmounts } from "./caluclate";

export interface BankAccountContextData {
    bankAccounts: AccountData[]
    overallData: AccountDataRow[]
}

export interface BankAccountContext {
    data: BankAccountContextData
    setBankAccounts: (bankAccounts: BankAccountContextData) => void
}

const initialStore: BankAccountContext = { data: { bankAccounts: [], overallData: [] }, setBankAccounts: () => { } }

const context = React.createContext(initialStore)

const useBankAccountStore = (immediate: boolean = false) => {
    const { data, setBankAccounts } = useContext(context)
    const { bankAccounts, overallData } = data
    const { bankAccounts: fetchedData, state, reloadData } = useBankAccounts({ immediate: immediate && _.isEmpty(bankAccounts) })

    useEffect(() => {
        if (state === FetchState.success) {
            const data = calcualateOverallAmounts(fetchedData)
            setBankAccounts({ bankAccounts: fetchedData, overallData: data })
        }
    }, [fetchedData])


    return {
        bankAccounts,
        overallData,
        state,
        reloadData
    }
}

const BankAccountStoreProvider = (props: React.PropsWithChildren) => {
    const { children } = props
    const { Provider } = context
    const [state, setState] = useState<BankAccountContextData>({ bankAccounts: [], overallData: [] })

    return (
        <Provider value={{ data: state, setBankAccounts: setState }}>
            {children}
        </Provider>
    )
}

export {
    BankAccountStoreProvider,
    useBankAccountStore
}

