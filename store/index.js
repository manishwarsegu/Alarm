import { createStore, combineReducers } from 'redux';
import alarmReducer from '../reducers/alarmReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  alarms: alarmReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export let configureStore = createStore(persistedReducer);
export let persistor = persistStore(configureStore);