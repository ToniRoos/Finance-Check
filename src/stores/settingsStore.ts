import { createStore } from "../logic/reducerStore";
import { settingsReducer } from "../modules/SettingsPage/settingsReducer";

const initialState = { categories: [] };

const { Provider: SettingsProvider, store: settingsStore } = createStore({
    initialState: initialState,
    reducer: settingsReducer
});

export { SettingsProvider, settingsStore };