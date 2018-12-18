var bittrex = require('node-bittrex-api');
bittrex.options({ 'apikey': process.env.BITTREX_APIKEY, 'apisecret': process.env.BITTREX_APISECRET });


var balances = () => {
    return new Promise((resolve, reject) => {
        bittrex.getbalances(function (data, err) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    })
}

var orders = () => {
    return new Promise((resolve, reject) => {
        bittrex.getopenorders({}, function (data, err) {
            if (err) {
                reject(err);
            }
            resolve(data);
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
