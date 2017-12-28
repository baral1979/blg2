var bittrex = require('node-bittrex-api');

bittrex.options({'apikey': '12dbca8a9a0e45a680f41e57c10af730', 'apisecret': '7d0964f292c2479db0a8345b82437cf6'});

var dep = new Promise((resolve, reject) => {
  bittrex.getdeposithistory({}, function( data, err ) {
    if (err) {
      reject(err);
    }

    resolve(data.result);
  });
});
//
var bal = new Promise((resolve, reject) => {
  bittrex.getbalances(function( data, err ) {
    if (err) {
      reject(err);
    }

    resolve(data.result);
  });
});

Promise.all([dep, bal]).then((data) => {

  console.log('all promise done!', data[0]);
});
