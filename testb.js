var bittrex = require('node-bittrex-api');

bittrex.options({'apikey': '12dbca8a9a0e45a680f41e57c10af730', 'apisecret': '7d0964f292c2479db0a8345b82437cf6'});

bittrex.getbalances(function(data, err) {
  if (err) {
    console.log('err', err);
  }

  if (data) {
    console.log('data', data);
    res.json({data: data.result});
  }
  else
    console.log('oups!');
  }
);
