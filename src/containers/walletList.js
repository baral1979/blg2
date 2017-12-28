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
            <Card
                title={<Amount onClick={this.handleCurrencyChange.bind(this)} currency={this.props.currency} value_btc={this.getTotal_BTC().toFixed(8)} value_usd={this.getTotal_USD().toFixed(2)}/>}
                category="TOTAL PORTFOLIO VALUE"
                ctTableFullWidth ctTableResponsive
                content={
                  <Table>
                        <thead>
                            <tr>

                              <th>Coin</th>
                              <th>Holdings</th>
                              <th>Price</th>

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
                        return <Coin currency={this.props.currency} coin={wallet} />
                      })
                }
                 </Table>}
            />
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
      <div>
      <Grid fluid>

        <Row>
          {this.createWalletList()}
        </Row>


      </Grid>
      </div>
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
