import React, { Component } from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions';
import StatsCard from '../components/StatsCard';
import Percent from '../components/Percent';
import Card from '../components/Card';
import Coin from '../components/Coin';
import Amount from '../components/Amount';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import ChartistGraph from 'react-chartist';

class OrdersList extends Component {

  // handleCurrencyChange() {
  //   if (this.props.currency === 'BTC')
  //     this.props.setCurrency('USD');
  //   if (this.props.currency === 'USD')
  //     this.props.setCurrency('BTC');
  // }

  // componentDidMount() {
  //   var url = window.location.origin + '/yolo';
  //   const resp = fetch(url).then((resp) => {
  //     resp.json().then((data) => {
  //       this.props.setCoins(data.coins);
  //     })
  //   });
  // }

  createOrdersList() {
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
      <div><div className="p5">
        <h1 className="totalP">Active Orders</h1>
      </div>
        <div className="coins">
          <Table>
            <thead>
              <tr>
                <th className="text-center" width='10%'>Coin</th>
                <th className="text-right" width='90%'>Details</th>
              </tr>
            </thead>
            {
              this.props.orders.map((order) => {
                return (
                  <tr >
                    <td className="text-center"><img src={`/assets/img/${order.dest.toLowerCase()}.png`} />
                      <br />
                      <span className="coin-symbol">{order.dest}</span><br />
                      <SourceLogo source={order.exchange} />
                    </td>
                    <td className="text-right">
                    <span  className="coin-symbol">{order.type} {order.quantity} {order.dest} @ {order.price} {order.source}</span><br />
                      
                    </td>
                   
                  </tr>
                )
              })
            }
          </Table>
        </div></div>
    )
  }

  // getTotal_USD() {
  //   var total = 0;
  //   for (var i = 0; i < this.props.wallets.length; i++) {
  //     total += this.props.wallets[i].value_usd;
  //   }

  //   return total;
  // }

  // getTotal_BTC() {
  //   var total = 0;
  //   for (var i = 0; i < this.props.wallets.length; i++) {
  //     total += this.props.wallets[i].value_btc;
  //   }

  //   return total;
  // }

  render() {
    if (this.props.orders && this.props.orders.length > 0)
      return (
        this.createOrdersList()
      );

    return null;
  }
}

function mapStateToProps(state) {
  return {
    orders: state.wallets.orders
  };
}



export default connect(mapStateToProps)(OrdersList);
