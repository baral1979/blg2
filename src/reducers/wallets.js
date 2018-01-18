const initialState = {
  wallets: [],
  currency: 'USD',
  totalvalue_usd: 0,
  totalmined_usd: 0,
  mining: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_COIN":
      state = {
        ...state,
        wallets: state.wallets.concat(action.payload)
      }
      break;
    case "SET_COINS":
      console.log('coins', action.payload);
      var totalusd = 0, totalbtc = 0, totalmined_usd = 0, totalmined_btc = 0;
      for (var i = 0; i < action.payload.length; i++) {

        if (action.payload[i].value_usd)
          totalusd += action.payload[i].value_usd;
        else console.log('no value_usd', action.payload[i]);

        if (action.payload[i].value_btc)
          totalbtc += action.payload[i].value_btc;
        else console.log('no value_btc', action.payload[i]);

        if (action.payload[i].mined_value_usd)
          totalmined_usd += action.payload[i].mined_value_usd;

        if (action.payload[i].mined_value_btc)
          totalmined_btc += action.payload[i].mined_value_btc;
      }

      state = {
        ...state,
        wallets: action.payload,
        totalvalue_usd: totalusd.toFixed(2),
        totalvalue_btc: totalbtc.toFixed(8),
        totalmined_usd: totalmined_usd.toFixed(2),
        totalmined_btc: totalmined_btc.toFixed(8),
        totaltrade_usd: (totalusd-totalmined_usd).toFixed(2),
        totaltrade_btc: (totalbtc-totalmined_btc).toFixed(8)
      };
      break;
    case "SET_CURRENCY":
      state = {
        ...state,
        currency: action.payload
      };
      break;
    case "SET_MINING":
       state = {
          ...state,
          mining: action.payload
      }
  }

  return state;
}

export default reducer;
