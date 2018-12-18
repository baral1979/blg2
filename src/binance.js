const api = require('binance');
const binanceRest = new api.BinanceRest({
    key: process.env.BINANCE_APIKEY, // Get this from your account on binance.com
    secret: process.env.BINANCE_APISECRET, // Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 5000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false,
    /*
     * Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
     * default those keys will be replaced with more descriptive, longer ones.
     */
    handleDrift: false
    /* Optional, default is false.  If turned on, the library will attempt to handle any drift of
     * your clock on it's own.  If a request fails due to drift, it'll attempt a fix by requesting
     * binance's server time, calculating the difference with your own clock, and then reattempting
     * the request.
     */
});

var balances = () => {
    return  new Promise((resolve, reject) => {
          binanceRest.account()
              .then((data) => {
                  resolve(data);
              })
              .catch((err) => {
                  reject(err);
              });
      })
  }

var orders = () => {
  return  new Promise((resolve, reject) => {
        binanceRest.openOrders()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

var getData = () => {
    return new Promise((resolve, reject) => {
        Promise.all([balances(), orders()]).then((d) => {
            resolve({
                balances: d[0],
                orders: d[1]
            })
        }).catch((e) => { reject(e); })
    });
}

module.exports = {
    getData
}


//getData().then(d => console.log(d));

//balances().then(d => { console.log(d); }).catch(e => { console.log(e) });

//getData.then(d => { console.log(d) });