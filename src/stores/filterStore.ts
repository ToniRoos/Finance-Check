import { createStore } from "../logic/reducerStore";
import { filterReducer } from "../reducer/filterReducer";

const initialState = { data: [] };

const { Provider: FilterProvider, store: filterStore } = createStore({
    initialState: initialState,
    reducer: filterReducer
});

export { FilterProvider, filterStore };