const initialState = {
  wallets: [],
  currency: 'USD',
  totalvalue_usd: 0,
  totalmined_usd: 0,
  total_pool: 0,
  mining: [],
  pool_balances: [],
  deposits: [],
  electricity: [],
  orders: []
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
      var totalusd = 0, totalbtc = 0, totalmined_usd = 0, totalmined_btc = 0;
      var all_deposits = [];
      for (var i = 0; i < action.payload.length; i++) {
        if (action.payload[i].deposits)
          all_deposits = all_deposits.concat(action.payload[i].deposits.map(x => { var r = x; x.symbol = action.payload[i].symbol; return r; }));

        if (action.payload[i].value_usd)
          totalusd += action.payload[i].value_usd;
        //else console.log('no value_usd', action.payload[i]);

        if (action.payload[i].value_btc)
          totalbtc += action.payload[i].value_btc;
        //else console.log('no value_btc', action.payload[i]);

        if (action.payload[i].mined_value_usd)
          totalmined_usd += action.payload[i].mined_value_usd;

        if (action.payload[i].mined_value_btc)
          totalmined_btc += action.payload[i].mined_value_btc;
      }

      all_deposits = all_deposits.reduce(function (groups, item) {
        var d = new Date(item.lastUpdated);
        var date = 1900 + d.getYear() + '-' + (parseInt(d.getMonth()) + 1) + '-' + d.getDate();
        groups[date] = groups[date] || [];
        groups[date].push(item);
        return groups;
      }, {});

      state = {
        ...state,
        wallets: action.payload,
        totalvalue_usd: totalusd.toFixed(2),
        totalvalue_btc: totalbtc.toFixed(8),
        totalmined_usd: totalmined_usd.toFixed(2),
        totalmined_btc: totalmined_btc.toFixed(8),
        totaltrade_usd: (totalusd - totalmined_usd).toFixed(2),
        totaltrade_btc: (totalbtc - totalmined_btc).toFixed(8)
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

    case "SET_DEPOSITS":
      state = {
        ...state,
        deposits: action.payload
      }
      break;

    case "SET_ORDERS":
      state = {
        ...state,
        orders: action.payload
      }
      break;
    case "SET_ELECT":

      const reducer = (accumulator, currentValue) => accumulator.amount + currentValue.amount;
      var sum = action.payload.reduce(reducer);
      console.log('total elect', sum);
      state = {
        ...state,
        electricity: action.payload
      }
      break;
    case "SET_POOL_BALANCES":

      var total_pool = 0;
      for (let index = 0; index < action.payload.length; index++) {
        const element = action.payload[index];
        total_pool += element.value_usd;
      }

      state = {
        ...state,
        total_pool: total_pool.toFixed(2),
        pool_balances: action.payload
      }
      break;
  }

  return state;
}

export default reducer;
