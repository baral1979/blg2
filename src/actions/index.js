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


export default {
  addCoin : addCoin,
  setCoins : setCoins
}
