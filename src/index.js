import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import {store} from './redux/store';
import './components/uquvbulimi/room/weekPiker.css'
import Spinner from "./components/spinner/Spinner";
import  './components/i18n/i18n.js'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.Suspense fallback={<Spinner/>}>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.Suspense>
);
