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
import expressJwt, {UnauthorizedError as Jwt401Error} from 'express-jwt';
// import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import {ErrorPageWithoutStyle} from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import router from './router';

import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import bittrex from 'node-bittrex-api';
import coins from './coins';

bittrex.options({'apikey': '12dbca8a9a0e45a680f41e57c10af730', 'apisecret': '7d0964f292c2479db0a8345b82437cf6'});

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: config.auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}),);
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

app.use('/deposit/:currency', async (req, res, next) => {
  bittrex.getdeposithistory({}, function( data, err ) {
    var total = 0;

    for (var i = 0; i < data.result.length; i++) {
      var trx = data.result[i];
      total += trx.Amount;
    }
    res.status(200);

    res.send(data.result);
  });
});

app.use('/test', async (req, res, next) => {

  bittrex.getbalances(function(data, err) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);

    if (data) {

      var urls = [];
      const grabContent = url => fetch(url).then(res => res.text()).then(html => {
        var data = JSON.parse(html);
        if (data.length === 1)
          coins.set(data[0]);
        }
      )

      for (var i = 0; i < data.result.length; i++) {
        var bal = data.result[i];
        var coin = coins.get(bal.Currency);
        if (coin) {
          var url = `https://api.coinmarketcap.com/v1/ticker/${coin.id}`;
          urls.push(url);
        }
      }

      Promise.all(urls.map(grabContent)).then(() => {
        coins.mergeBalances(data.result);
        res.status(200);
        res.json(coins.all());
      });
    } else
      res.send('oups!');
    }
  );
});

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
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>,);
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

    const html = ReactDOM.renderToStaticMarkup(<Html {...data}/>);
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
    {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err}/>)}
  </Html>,);
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
