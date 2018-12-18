const addCoin = (coin) => {
  return {
    type: 'ADD_COIN',
    payload: coin
  };
};

const setCoins = (coins) => {
  return {
    type: 'SET_COINS',
    payload: coins
  }
};

const setCurrency = (currency) => {
  return {
    type: 'SET_CURRENCY',
    payload: currency
  }
};

const setStats = (totalValue, payload) => {
  return {
    type: 'SET_TOTALVALUE',
    payload: payload
  }
};

const setElectricity = (electricity) => {
  return {
    type: 'SET_ELECT',
    payload: electricity
  }
};

const setPoolBalances = (balances) => {
  return {
    type: 'SET_POOL_BALANCES',
    payload: balances
  }
};

const setOrders = (orders) => {
  return {
    type: 'SET_ORDERS',
    payload: orders
  }
};

export default {
  addCoin : addCoin,
  setCoins : setCoins,
  setCurrency: setCurrency,
  setStats: setStats,
  setPoolBalances,
  setElectricity,
  setOrders
}
