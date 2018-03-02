import React, { Component } from 'React';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import actions from '../actions';
import StatsCard from '../components/StatsCard';
import Percent from '../components/Percent';
import Card from '../components/Card';
import Coin from '../components/Coin';
import Amount from '../components/Amount';
import { Grid, Row, Col, Table  } from 'react-bootstrap';
import ChartistGraph from 'react-chartist';

class WalletList extends Component {

  handleCurrencyChange() {
    if (this.props.currency === 'BTC')
      this.props.setCurrency('USD');
    if (this.props.currency === 'USD')
      this.props.setCurrency('BTC');
  }

  componentDidMount() {
    var url = window.location.origin + '/test';
    const resp = fetch(url).then((resp) => {
      resp.json().then((data) => {
        this.props.setCoins(data);
      })
    });
  }

  createWalletList() {
      return (
        <div className="coins">
                  <Table>
                        <thead>
                            <tr>

                              <th className="text-center" width='10%'>Coin</th>
                              <th className="text-right" width='40%'>Holdings</th>
                              <th className="text-right">Price</th>

                            </tr>
                        </thead>
                        {
                      this.props.wallets.sort((a,b) => {
                        if (a.value_usd < b.value_usd)
                          return 1;
                        if (a.value_usd > b.value_usd)
                          return -1;
                        return 0;
                      }).map((wallet) => {
                        if (!wallet || wallet.balance <= 0 || !wallet.value_usd)
                          return null;
                        return <Coin currency={this.props.currency} coin={wallet} />
                      })
                }
                 </Table>}
            /></div>
      )
  }



  getTotal_USD() {
    var total = 0;
    for (var i = 0; i < this.props.wallets.length; i++) {
      total += this.props.wallets[i].value_usd;
    }

    return total;
  }

  getTotal_BTC() {
    var total = 0;
    for (var i = 0; i < this.props.wallets.length; i++) {
      total += this.props.wallets[i].value_btc;
    }

    return total;
  }

  render() {
    return (
        this.createWalletList()
    );
  }
}

function mapStateToProps(state) {
  return {
    wallets: state.wallets.wallets,
    currency: state.wallets.currency
  };
}

function mapDispatchToProps(dispath) {
  return bindActionCreators({setCoins: actions.setCoins, setCurrency: actions.setCurrency, setStats: actions.setStats}, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(WalletList);
