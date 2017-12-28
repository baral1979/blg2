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

export default {
  addCoin : addCoin,
  setCoins : setCoins,
  setCurrency: setCurrency,
  setStats: setStats
}
