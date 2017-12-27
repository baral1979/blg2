const initialState = {
  wallets: [{
    symbol: 'ETH',
    value: '0.01'
  }]
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_COIN":
      state = {
        ...state,
        wallets: state.wallets.concat(action.payload)
      }
      break;
    case "SET":
      state = {
        ...state,
        wallets: action.payload
      };
      break;
  }

  return state;
}

export default reducer;
