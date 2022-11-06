import { useEffect, useState } from "react";
import { AccountData } from "../logic/helper";
import { fetchBankAccountData } from "./api";

interface BankAccountApiOptions {
    immediate?: boolean
}

enum FetchState {
    loading,
    initial,
    success,
    error
}

export const useBankAccounts = (options?: BankAccountApiOptions) => {

    const immediate = options?.immediate ?? false
    const [bankAccounts, setBankAccounts] = useState<AccountData[]>([])
    const [state, setState] = useState<FetchState>(FetchState.initial)

    useEffect(() => {
        if (immediate) {
            reloadData()
        }
    }, [])

    const reloadData = () => {
        setState(FetchState.loading)
        fetchBankAccountData().then(data => {
            setBankAccounts(data)
            setState(FetchState.success)
        }).catch(err => {
            console.error(err)
            setState(FetchState.error)
        })
    }

    return { state, bankAccounts, reloadData }
}