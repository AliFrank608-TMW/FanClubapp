import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import modules from './Modules'

export default function configureStore(initialState, navReducer) {
    const finalCreateStore = applyMiddleware(thunkMiddleware)(createStore)
    const reducers = combineReducers({...modules, nav: navReducer})
    return finalCreateStore(reducers, initialState)
}

