/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import React from 'react';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { configureStore, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const RNRedux = () => (
    <Provider store={configureStore}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
