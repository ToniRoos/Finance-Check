import *  as React from 'react';

export interface Action {
    type: string;
    payload?: any;
}

export interface GenericReducer<T, U extends Action> extends React.PropsWithChildren<any> {
    reducer: (state: T, action: U) => T;
    initialState: T;
}

function createStore<TState, TAction extends Action>(reducerData: GenericReducer<TState, TAction>) {

    const initialStore = {
        state: reducerData.initialState,
        dispatch: (action: TAction) => { }
    };

    const store = React.createContext(initialStore);
    const Provider = (props: React.PropsWithChildren<any>) => {

        const [state, dispatch] = React.useReducer(reducerData.reducer, reducerData.initialState);
        const { Provider } = store;
        return <Provider value={{ state, dispatch }}> {props.children} </Provider>;
    };

    return {
        Provider,
        store
    };
}

export { createStore };