var bittrex = require('./bittrex');
var binance = require('./binance');
var coinFilter = require('./coinFilter');
var coinmarketcap = require('./coinmarketcap');
var otherCoins = require('./othercoins');

var mapBinanceResult = (data) => {
    // balances
    var balances = data.balances.balances.filter(x => { return coinFilter.show(x.asset, 'Binance') });
    var coins = balances.map(x => { return { data: x, source: 'Binance', coin: x.asset, available: parseFloat(x.free), reserved: parseFloat(x.locked) } });
    coins = coins.filter(x => { return x.available + x.reserved > 0; })

    // orders
    var orders = [];
    if (data.orders && data.orders.length > 0) {
        orders = data.orders.map(x => {
            var source = x.symbol.substring(x.symbol.length - 3)
            dest = x.symbol.substring(0, x.symbol.length - 3);
            return {
                exchange: 'Binance',
                source,
                dest,
                quantity: parseFloat(x.origQty),
                quantityRemaining: parseFloat(x.origQty) - parseFloat(x.executedQty),
                type: x.side,
                price: parseFloat(x.price)
            }
        });
    }

    return {
        coins,
        orders: orders.filter(x => { return coinFilter.show(x.dest, 'Binance') })
    }
}

var mapBittrexResult = (data) => {
    //balances
    var balances = data.balances.result.filter(x => { return coinFilter.show(x.Currency, 'Bittrex') });
    console.log(balances.map(x => {return  x.Available }));
    var coins = balances.map(x => { return { data: x, source: 'Bittrex', coin: x.Currency, available: x.Available, reserved: x.Balance - x.Available } });
    coins = coins.filter(x => { return x.available + x.reserved > 0; })

    // orders
    var orders = [];
    if (data.orders.result && data.orders.result.length > 0) {
        orders = data.orders.result.map(x => {
            var source = x.Exchange.substring(0, x.Exchange.indexOf('-')),
                dest = x.Exchange.replace(source + '-', '');

            return {
                exchange: 'Bittrex',
                source,
                dest,
                quantity: x.Quantity,
                quantityRemaining: x.QuantityRemaining,
                type: x.OrderType === 'LIMIT_BUY' ? 'BUY' : 'SELL',
                price: x.Limit
            }
        });
    }

    return {
        coins,
        orders: orders.filter(x => { return coinFilter.show(x.dest, 'Bittrex') })
    }
}

var appendToResult = (array, coin) => {
    coinFilter.adjustBalance(coin);
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.coin === coin) {
            element.available += coin.available;
            element.
                return;
        }
    }

    array.push(coin);
}

var prepareResults = (binance, bittrex) => {

    var coins = binance.coins;
    var orders = binance.orders;

    // Merge binance and bittrex balances
    for (let index = 0; index < bittrex.coins.length; index++) {
        coins.push(bittrex.coins[index]);
    }

    //Append other coins
    var others = otherCoins.coins();
    for (let index = 0; index < others.length; index++) {
        const element = others[index];
        coins.push(element);

    }

    // Merge biance and bittrex open orders
    for (let index = 0; index < bittrex.orders.length; index++) {
        orders.push(bittrex.orders[index]);
    }

    // adjust all coins balance
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coinFilter.adjustBalance(coin);
    }

    return {
        coins,
        orders
    }
}

var getBalances = () => {
    return new Promise((resolve, reject) => {
        Promise.all([bittrex.getData(), binance.getData()]).then((d) => {
            var bittrex = mapBittrexResult(d[0]);
            var binance = mapBinanceResult(d[1]);

            var r = prepareResults(binance, bittrex);

            // get coinmarketcap.com stats
            // get coin market cap data for all coins
            coinmarketcap.getStats(r.coins.map(x => { return x.coin })).then(stats => {
                for (let i = 0; i < r.coins.length; i++) {
                    const coin = r.coins[i];

                    var stat = stats.filter(x => { return x.symbol === coin.coin; });

                    if (stat && stat.length > 0)
                        coin.stats = stat[0];
                }



                resolve(r);
            });
        }).catch((e) => { reject(e); })
    });
}

module.exports = {
    getBalances
}
console.log(otherCoins.coins());
//getBalances().then(d => console.log(d));