import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import {Provider} from "react-redux";
import {store} from './store';
import {AppProvider} from "./context/AppContext";
import {GoogleOAuthProvider} from "@react-oauth/google";
import './shared/assets/styles/Fonts.module.scss'
import {AuthProvider} from "./context/AuthProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <AuthProvider>
            <GoogleOAuthProvider clientId="220593066561-qilqsv6qs41fobvmu2poh0t2uql96ghd.apps.googleusercontent.com">
                <AppProvider>
                    <App/>
                </AppProvider>
            </GoogleOAuthProvider>
        </AuthProvider>
    </Provider>
);