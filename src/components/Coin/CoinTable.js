import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import Percent from '../Percent';
import Amount from '../Amount';


export class Coin extends Component {

  getColor(source) {
    var stringHexNumber = (                       // 1
      parseInt(                                 // 2
        parseInt(source, 36)  // 3
          .toExponential()                  // 4
          .slice(2, -5)                      // 5
        , 10) & 0xFFFFFF                          // 6
    ).toString(16).toUpperCase();

    return { background: '#' + stringHexNumber };
  }

  test() {

    if (this.props.coin.mined_value_usd) {
      return (<tr>
        <td>
          Mining Earnings
          </td>
        <td>{this.props.coin.mined_qty}</td>
        <td><Amount currency={this.props.currency} value_usd={this.props.coin.mined_value_usd.toFixed(2)} value_btc={this.props.coin.mined_value_btc.toFixed(8)} /></td>
      </tr>
      )
    }

    return null;
  }




  render() {
    var coin = this.props.coin;

    function SourceLogo(props) {

      function getColor(source) {
        var stringHexNumber = (                       // 1
          parseInt(                                 // 2
            parseInt(source, 36)  // 3
              .toExponential()                  // 4
              .slice(2, -5)                      // 5
            , 10) & 0xFFFFFF                          // 6
        ).toString(16).toUpperCase();

        return { background: '#' + stringHexNumber };
      }

      var source = "Offline";
      if (props && props.source)
        source = props.source


      return (<label className="label label-primary" style={getColor(source)}>{source}</label>)


    }


    return (
      <tbody key={coin.id}>
        <tr >
          <td className="text-center"><img src={`/assets/img/${coin.symbol.toLowerCase()}.png`} />
            <br />
            <span className="coin-symbol">{coin.symbol}</span><br />
            <SourceLogo source={coin.source} />
          </td>
          <td className="text-right">
            <Amount currency={this.props.currency} value_usd={coin.value_usd.toFixed(2)} value_btc={coin.value_btc.toFixed(8)} />
            <br />
            {coin.balance}
          </td>
          <td className="text-right">
            <Amount currency={this.props.currency} value_usd={coin.price_usd} value_btc={coin.price_btc} />
            <br />
            <Percent value={coin.percent_change_24h} />
          </td>
        </tr>
      </tbody>
    );
  }
}

export default Coin;
