export const addCoin = (coin) => {
  console.log('Coin added', coin);
  return {
    type: 'ADD_COIN',
    payload: coin
  };
}
