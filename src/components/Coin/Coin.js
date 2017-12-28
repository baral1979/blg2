import React, { Component } from 'react';
import { Grid, Row, Col, Table  } from 'react-bootstrap';
import Percent from '../Percent';
import Amount from '../Amount';


export class Coin extends Component{
    render(){
        var coin = this.props.coin;
        console.log(coin);
        return (
          <tbody key={coin.id}>
            <tr >
              <td><img src={`https://files.coinmarketcap.com/static/img/coins/16x16/${coin.id}.png`}/></td>
              <td><Amount currency={this.props.currency} value_usd={coin.value_usd.toFixed(2)} value_btc={coin.value_btc.toFixed(8)}/></td>
              <td><Amount currency={this.props.currency} value_usd={coin.price_usd} value_btc={coin.price_btc}/></td>
            </tr>
            <tr>
              <td>{coin.symbol}</td>
              <td>{coin.balance + coin.pending}</td>
              <td><Percent value={coin.percent_change_24h}/></td>
            </tr>
          </tbody>
        );
    }
}

export default Coin;
