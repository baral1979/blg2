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
    id: "zclassic",
    name: "ZClassic",
    symbol: "ZCL"
  },
  {
    id: "ethereum",
    name: "Ether",
    symbol: "ETH"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA"
  },
  {
    id: "achain",
    name: "Achain",
    symbol: "ACT"
  },
  {
    id: "komodo",
    name: "Komodo",
    symbol: "KMD"
  },
  {
    id: "nav-coin",
    name: "NavCoin",
    symbol: "NAV"
  },{
    id: "bitcoin",
    name: "Bitcion",
    symbol: "BTC"
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
  },
  {
    id: "raiblocks",
    name: "RaiBlocks",
    symbol: "XRB"
  }

];

const coinsToAdd = [
  {
    Currency: 'ACT',
    Balance: 19.74235, // 456.8935, //
    Pending: 0,
    Available: 0,
    Source: 'Kucoin'
  },
  {
    Currency: 'XRB',
    Balance: 12.77133089,
    Pending: 0,
    Available: 0,
    Source: 'Kucoin'
  }
]

const set = function(data) {
  var coin = get(data.symbol);

  if (coin) {
    coin.price_usd = data.price_usd;
    coin.price_btc = data.price_btc;
    coin.percent_change_1h = data.percent_change_1h;
    coin.percent_change_24h = data.percent_change_24h;
    coin.percent_change_7d = data.percent_change_7d;
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

const mergeBalances = function(balances) {
  for (var i = 0; i < balances.length; i++) {
    mergeBalance(balances[i]);
  }
}

const mergeBalance = function(data) {
  var coin = get(data.Currency);

  if (data.Currency === 'ZCL')
    data.Balance -= 0.3917997208;

  if (coin) {
    coin.balance = data.Balance;
    coin.pending = data.Pending;
    coin.address = data.CryptoAddress;
    coin.source = data.Source;
    coin.value_usd = (coin.balance + coin.pending) * coin.price_usd;
    coin.value_btc = (coin.balance + coin.pending) * coin.price_btc;
  };
}

const mergeDeposits = function(data) {


  for (var i = 0; i < coins.length; i++) {
    if (!coins[i].deposits)
      continue;

      coins[i].deposits = [];
  }

  for (var i = 0; i < data.length; i++) {
    var dep = data[i];
    var dt = new Date(dep.LastUpdated);

    if (dt < new Date('2017-11-18'))
      continue;

    var coin = get(dep.Currency);
    if (coin) {
      if (!coin.deposits)
        coin.deposits = [];

      coin.deposits.push({
        amount: dep.Amount,
        lastUpdated: dep.LastUpdated
      });
    }
  }

  for (var i = 0; i < coins.length; i++) {
    if (!coins[i].deposits)
      continue;

    function getSum(a, b) {
      if (a.amount)
        return a.amount + b.amount;
      return a + b.amount;
    }

    var sum = coins[i].deposits.reduce(getSum);
    coins[i].mined_qty = sum;
    coins[i].mined_value_usd = sum * coins[i].price_usd;
    coins[i].mined_value_btc = sum * coins[i].price_btc;
  }
}

export default {
  get: get,
  set: set,
  mergeBalances: mergeBalances,
  mergeDeposits: mergeDeposits,
  all: function() {
    return coins;
  },
  coinsToAdd: coinsToAdd
}
