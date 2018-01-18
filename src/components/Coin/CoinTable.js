import React, { Component } from 'react';
import { Grid, Row, Col, Table  } from 'react-bootstrap';
import Percent from '../Percent';
import Amount from '../Amount';


export class Coin extends Component{

    getColor(source) {
      var stringHexNumber = (                       // 1
              parseInt(                                 // 2
                  parseInt(source, 36)  // 3
                      .toExponential()                  // 4
                      .slice(2,-5)                      // 5
              , 10) & 0xFFFFFF                          // 6
          ).toString(16).toUpperCase();

      return {background: '#' + stringHexNumber};
    }

    test() {

      if (this.props.coin.mined_value_usd) {
        return (<tr>
          <td>
            Mining Earnings
          </td>
            <td>{this.props.coin.mined_qty}</td>
            <td><Amount currency={this.props.currency} value_usd={this.props.coin.mined_value_usd.toFixed(2)} value_btc={this.props.coin.mined_value_btc.toFixed(8)}/></td>
          </tr>
        )
      }

      return null;
    }

    render(){
        var coin = this.props.coin;
        return (
          <tbody key={coin.id}>
            <tr >
              <td><img src={`https://files.coinmarketcap.com/static/img/coins/16x16/${coin.id}.png`}/>{" "}<span className="label label-default" style={this.getColor(coin.source)}>{coin.source}</span></td>
              <td><Amount currency={this.props.currency} value_usd={coin.value_usd.toFixed(2)} value_btc={coin.value_btc.toFixed(8)}/></td>
              <td><Amount currency={this.props.currency} value_usd={coin.price_usd} value_btc={coin.price_btc}/></td>
            </tr>
            <tr>
              <td>{coin.symbol}</td>
              <td>{coin.balance + coin.pending}</td>
              <td><Percent value={coin.percent_change_24h}/></td>
            </tr>
            {this.test()}
          </tbody>
        );
    }
}

export default Coin;
