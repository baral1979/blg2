import {combineReducers} from 'redux';
import walletReducer from './wallets.js';

const reducers = combineReducers({
  wallets: walletReducer
})

export default reducers;
