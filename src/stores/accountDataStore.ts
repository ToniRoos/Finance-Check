import * as React from "react";
import { createStore } from "../logic/reducerStore";
import { accountDataReducer } from "../reducer/accountDataReducer";

const initialState = { accountList: [], data: [] };

const { Provider: DataAccountProvider, store: dataAccountStore } = createStore({
    initialState: initialState,
    reducer: accountDataReducer
});


export const useDataAccountStore = () => React.useContext(dataAccountStore);

export { DataAccountProvider, dataAccountStore };