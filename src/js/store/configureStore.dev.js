import {createStore,applyMiddleware,compose} from 'redux';
import {persistState} from 'redux-devtools';
import rootReducer from '../reducers/index.js';
import DevTools from '../containers/DevTools.jsx';

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

const enhancer = compose(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
      ),
    DevTools.instrument(),
    persistState(getDebugSessionKey())
);

function getDebugSessionKey(){
    const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
    return (matches && matches.length > 0)? matches[1]:null;
}

export default function configureStore(initialState){
    const store = createStore(rootReducer,initialState,enhancer);

    if (module.hot) {
        module.hot.accept('../reducers/index.js',()=>{
            store.replaceReducer(require('../reducers/index.js'))
        })
    }
    return store;
}
