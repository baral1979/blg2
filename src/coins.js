const coins = [{
    id: "zencash",
    name: "ZenCash",
    symbol: "ZEN"
  }, {
    id: "zcash",
    name: "Zcash",
    symbol: "ZEC"
  },
  {
    id: "ethereum",
    name: "Ether",
    symbol: "ETH"
  },
  {
    id: "nav-coin",
    name: "NavCoin",
    symbol: "NAV"
  }, {
    id: "feathercoin",
    name: "FeatherCoin",
    symbol: "FTC"
  },
  {
    id: "vertcoin",
    name: "VertCoin",
    symbol: "VTC"
  },
  {
   id: "stellar",
   name: "Stellar Lumen",
   symbol: "XLM"
 }
];
const set = function(data) {
  var coin = get(data.symbol);

  if (coin) {
    coin.price_usd = data.price_usd;
    coin.price_btc = data.price_btc;
    coin.percent_change_1h = data.percent_change_1h;
    coin.percent_change_24h = data.percent_change_24h;
    coin.percent_change_7d = data.percent_change_24h;
  };
}

const get = function(symbol) {

  var data = coins.filter((x) => {
    return x.symbol === symbol;
  });

  if (data.length === 1)
    return data[0];

  return null;
}

const mergeBalances = function (balances) {
  for (var i = 0; i < balances.length; i++) {
    mergeBalance(balances[i]);
  }
}

const mergeBalance = function(data) {
  var coin = get(data.Currency);

  if (coin) {
    coin.balance = data.Balance;
    coin.pending = data.Pending;
    coin.address = data.CryptoAddress;
    coin.value_usd = (coin.balance + coin.pending) * coin.price_usd;
    coin.value_btc = (coin.balance + coin.pending) * coin.price_btc;
  };
}

export default {
  get: get,
  set: set,
  mergeBalances: mergeBalances,
  all: function () { return coins; }
}
