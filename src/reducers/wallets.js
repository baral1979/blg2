const initialState = {
  wallets: [],
  currency: 'USD'
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
      state = {
        ...state,
        wallets: action.payload
      };
      break;
    case "SET_CURRENCY":
      state = {
        ...state,
        currency: action.payload
      };
      break;
  }

  return state;
}

export default reducer;
