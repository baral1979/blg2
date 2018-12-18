var bittrex = {
    alex: {
        BTC: -0.005524662,
        ZCL: -1
    },
    excludes: ['ETC']
}

var binance = {
    alex: { BTC: -0.00283015 },
    includes: ['ETH', 'EOS', 'BTC']
}

var showBinance = (coin) => {
    return binance.includes.indexOf(coin) >= 0;
}

var showBittrex = (coin) => {
    return !(bittrex.excludes.indexOf(coin) >= 0);
}

var show = (coin, source) => {
    if (source === 'Bittrex')
        return showBittrex(coin);

    if (source === 'Binance')
        return showBinance(coin);

}

var adjustBalance = (coin) => {
    // Bittrex
    if (coin.source === 'Bittrex') {
        if (bittrex.alex[coin.coin]) {
            coin.available += bittrex.alex[coin.coin];
        } 
    }

    // Binance
    if (coin.source === 'Binance') {
        if (binance.alex[coin.coin])
            coin.available += binance.alex[coin.coin];
    }
}

module.exports = {
    show,
    adjustBalance
}

