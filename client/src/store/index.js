import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const loginReducer = (state = { user: null, phone: "", city: "" }, action) => {
    if (action.type === 'login') {
        return {
            user: true,
            phone: action.phone,
            city: action.city
        }
    }
    else if (action.type === 'logout') {
        return {
            user: null,
            phone: "",
            city: ""
        }
    }
    else if (action.type === 'changeCity') {
        return {
            ...state,
            city: action.newCity
        };
    } else {
        return state;
    }
}

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, loginReducer);


const dataStore = createStore(persistedReducer);

const persistor = persistStore(dataStore);

export { dataStore, persistor }