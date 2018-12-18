/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
// import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import router from './router';

import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import bittrex from 'node-bittrex-api';
import coins from './coins';
import electricity from './electricity';
import twilio from 'twilio';
import schedule from 'node-schedule';
import balances from './balancesRoute';
var bal = require('./balances');

const MessagingResponse = require('twilio').twiml.MessagingResponse;

console.log('key', process.env.BITTREX_APIKEY, 'secret', process.env.BITTREX_APISECRET)
bittrex.options({ 'apikey': process.env.BITTREX_APIKEY, 'apisecret': process.env.BITTREX_APISECRET });

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: config.auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}), );
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

if (__DEV__) {
  app.enable('trust proxy');
}
//(SELL|sell|Sell)
app.use('/deposit/:currency', async (req, res, next) => {
  bittrex.getdeposithistory({}, function (data, err) {
    var total = 0;

    for (var i = 0; i < data.result.length; i++) {
      var trx = data.result[i];
      total += trx.Amount;
    }
    res.status(200);
    res.send(data.result);
  });
});

const sendMessage = function (msg, phone) {
  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  client.messages
    .create({
      to: phone,
      from: '+14188008521',
      body: msg,
    })
    .then(message => console.log(message.sid));
};

const sell = function (coin, phone) {
  bittrex.getbalances(function (data, err) {
    if (err) {
      sendMessage('There was an error getting your ' + coin + ' balance on Bittrex!', phone);
      return;
    }

    var w = data.result.filter((d) => { return d.Currency === coin; });
    if (w && w.length === 1) {

      sendMessage(`Alright! Selling ${w[0].Balance} ${w[0].Currency} !`, phone);
      return;
    }

    sendMessage('Looks like you don\'t have any ' + coin + ' on Bittrex!', phone);
  });
  console.log('selling ' + coin);
}

app.use('/yolo', async (req, res, next) => {
  bal.getBalances().then(r => {
    var coins = r.coins.map(x => {
      return {
        id: x.stats.id,
        name: x.stats.name,
        symbol: x.coin,
        price_usd: x.stats.price_usd,
        price_btc: x.stats.price_btc,
        percent_change_1h: x.stats.percent_change_1h,
        percent_change_24h: x.stats.percent_change_24h,
        percent_change_7d: x.stats.percent_change_7d,
        balance: x.available + x.reserved,
        source: x.source,
        value_usd: (x.available + x.reserved) * x.stats.price_usd,
        value_btc: (x.available + x.reserved) * x.stats.price_btc,
      }
    });
    res.status(200);
    res.json({coins: coins, orders: r.orders});
  }).catch(e => {
    res.status(400);
    res.json(e);
  })
});

//
// Mining Details
// -----------------------------------------------------------------------------
app.use('/pools', async (req, res, next) => {

  // MiningPoolHub
  var pools = ['monero', 'zcash', 'zclassic', 'feathercoin', 'zencash', 'bitcoin-gold'];

  var urls = pools.map(p => {
    return "https://" + p + ".miningpoolhub.com/index.php?page=api&action=getdashboarddata&api_key=18cd5879937bf6b16c055d29790dbfad40b2271f36153672827512c9e9c3bda0"
  });

  const grabContent = url => fetch(url).then(res => res.text()).then(html => {
    return JSON.parse(html);
  });

  // Yiimp
  var yiimp = new Promise((resolve, reject) => {
    var t = fetch('http://yiimp.eu/site/title_results?address=DNx8YKJp7JzVXmXRCs4gzdMoxTqnD1o68w').then(res => res.text()).then(html => {
      resolve(html);
    }).catch((err) => { reject(err) });
  });

  // Nano

  var nanoEth = new Promise((resolve, reject) => {
    var t = fetch('https://api.nanopool.org/v1/eth/balance/0xb6b703303e266a6bfd8237f9cd65f498f16ed1a3').then(res => res.text()).then(html => {
      resolve(html);
    }).catch((err) => { reject(err) });
  });


  var uu = urls.map(grabContent).concat(nanoEth);

  //uu = uu.concat(yiimp);
  console.log('uu', uu.length);
  Promise.all(uu).then((result) => {
    var pools = result.slice(0, result.length - 1).map(function (x) {
      return {
        balance: x.getdashboarddata.data.balance.confirmed + x.getdashboarddata.data.balance.unconfirmed,
        symbol: x.getdashboarddata.data.pool.info.currency,
        pool: 'MiningPoolHub'
      };
    });

    console.log('nano', result[result.length - 1]);

    // try {
    //   // var yimp = result[result.length - 1];
    //   // var xvgBalance = parseFloat(yimp.split('-')[0].replace('XVG', ''));

    //   pools.push(
    //     {
    //       balance: 0.1,
    //       symbol: 'XVG',
    //       pool: 'YiiMP'
    //     }
    //   )
    // } catch (error) {

    // }

    try {
      var nano = JSON.parse(result[result.length - 1]);

      pools.push(
        {
          balance: parseFloat(nano.data),
          symbol: 'ETH',
          pool: 'Nano'
        }
      )
    } catch (error) {

    }

    // Get Prices on coinmarketcap
    const getPrice = url => fetch(url).then(res => res.text()).then(html => {
      var data = JSON.parse(html);
      if (data.length === 1)
        coins.set(data[0]);
    });

    var urls = [];
    for (let index = 0; index < pools.length; index++) {
      const element = pools[index];
      var coin = coins.get(element.symbol);
      if (coin) {
        var url = `https://api.coinmarketcap.com/v1/ticker/${coin.id}`;
        urls.push(url);
      }
    }

    Promise.all(urls.map(grabContent)).then((result) => {
      for (let index = 0; index < pools.length; index++) {
        const pool = pools[index];
        var stats = result.filter(x => { return x[0].symbol === pool.symbol });
        if (stats && stats.length > 0 && stats[0] && stats[0].length) {
          pool.value_usd = pool.balance * parseFloat(stats[0][0].price_usd);
          pool.value_btc = pool.balance * parseFloat(stats[0][0].price_btc);
          pool.price_usd = stats[0][0].price_usd;
          pool.price_btc = stats[0][0].price_btc;
          pool.percent_change_24h = stats[0][0].percent_change_24h;
        }
      }

      res.status(200);
      res.json(pools);
    }).catch((err) => {
      res.status(400);
      res.json(err);
    });




  }).catch((err) => {
    res.status(400);
    res.json(err);
  });
});



app.use('/electricity', async (req, res, next) => {
  res.status(200);
  res.json(electricity.electricity);
});

app.use

app.use('/test', async (req, res, next) => {
  var dep = new Promise((resolve, reject) => {
    try {
      if (process.env.BITTREX_APIKEY === undefined)
        reject({ error: 'Exchange not properly configured' });

      bittrex.getdeposithistory({}, function (data, err) {
        if (err) {
          reject(err);
        }

        resolve(data.result);
      });
    } catch (error) {
      reject(error);
    }
  });

  var bal = new Promise((resolve, reject) => {
    try {
      if (process.env.BITTREX_APIKEY === undefined)
        reject({ error: 'Exchange not properly configured' });
      bittrex.getbalances(function (data, err) {
        if (err) {
          reject(err);
        }

        resolve(data.result);
      });
    } catch (error) {
      reject(error);
    }
  });

  try {
    Promise.all([dep, bal]).then((data) => {
      var deposits = data[0];
      var balances = data[1];

      for (var i = 0; i < data[1].length; i++) {
        data[1][i].Source = 'Bittrex';
      }

      balances = data[1].concat(coins.coinsToAdd);
      var urls = [];

      const grabContent = url => fetch(url).then(res => res.text()).then(html => {
        var data = JSON.parse(html);

        if (data.length === 1) {
          coins.set(data[0]);
        }
      });

      //console.log(deposits);
      // get stats
      for (var i = 0; i < balances.length; i++) {
        var bal = balances[i];
        var coin = coins.get(bal.Currency);
        if (coin) {
          var url = `https://api.coinmarketcap.com/v1/ticker/${coin.id}`;
          urls.push(url);
        }
      }

      Promise.all(urls.map(grabContent)).then((result) => {
        coins.mergeBalances(balances);
        coins.mergeDeposits(deposits);
        res.status(200);

        res.json(coins.all());
      }).catch((err) => {
        res.status(400);
        res.json(err);
      });

    }).catch((err) => {
      res.status(400);
      res.json(err);
    });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.use('/balance', balances);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Universal HTTP client
      fetch: createFetch(fetch, {
        baseUrl: config.api.serverUrl,
        cookie: req.headers.cookie
      })
    };

    const route = await router.resolve({
      ...context,
      pathname: req.path,
      query: req.query
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = {
      ...route
    };
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>, );
    data.styles = [
      {
        id: 'css',
        cssText: [...css].join('')
      }
    ];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(<Html title="Internal Server Error" description={err.message} styles={[{
    id: 'css',
    cssText: errorPageStyle._getCss()
  }
  ]}
  // eslint-disable-line no-underscore-dangle

  >
    {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
  </Html>, );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
//const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  //promise.then(() => {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
  //});
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
