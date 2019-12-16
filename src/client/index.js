import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom'
import App from './App';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import reducer from './redux/reducers';

const store = createStore(reducer,
    applyMiddleware(thunk));

render (
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);