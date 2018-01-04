import React, { Component } from 'React';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import actions from '../actions';
import StatsCard from '../components/StatsCard';
import WalletList from './walletList';
import Mining from './mining';
//import Percent from '../components/Percent';
//import Card from '../components/Card';
//import Coin from '../components/Coin';
import Amount from '../components/Amount';
import { Grid, Row, Col, Table  } from 'react-bootstrap';

class Stats extends Component {

  handleCurrencyChange() {
    if (this.props.currency === 'BTC')
      this.props.setCurrency('USD');
    if (this.props.currency === 'USD')
      this.props.setCurrency('BTC');
  }

  render() {
    return (
      <Grid fluid>
        <Row>
            <Col lg={3} sm={6}>
                 <StatsCard
                     bigIcon={<span className="glyphicon glyphicon-usd"/>}
                     statsText="Total Value"
                     statsValue={<Amount onClick={this.handleCurrencyChange.bind(this)} currency={this.props.currency} value_usd={this.props.totalvalue_usd} value_btc={this.props.totalvalue_btc}/>}
                     statsIcon={<span className="glyphicon glyphicon-btc"/>}
                     statsIconText={this.props.totalvalue_btc}
                     content={null}
                 />
             </Col>
             <Col lg={3} sm={6}>
                 <StatsCard
                     bigIcon={<span className="glyphicon glyphicon-tasks"/>}
                     statsText="Total Mined"
                     statsValue={<Amount onClick={this.handleCurrencyChange.bind(this)} currency={this.props.currency} value_usd={this.props.totalmined_usd} value_btc={this.props.totalmined_btc}/>}
                     statsIcon={<span className="glyphicon glyphicon-btc"/>}
                     statsIconText={this.props.totalmined_btc}
                 />
              </Col>
              <Col lg={3} sm={6}>
                  <StatsCard
                      bigIcon={<span className="glyphicon glyphicon-transfer"/>}
                      statsText="Total Trading"
                      statsValue={<Amount onClick={this.handleCurrencyChange.bind(this)} currency={this.props.currency} value_usd={this.props.totaltrade_usd} value_btc={this.props.totaltrade_btc}/>}
                      statsIcon={<span className="glyphicon glyphicon-btc"/>}
                      statsIconText={this.props.totaltrade_btc}
                  />
               </Col>
               <Col lg={3} sm={6}>
                   <Mining />
                </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    totalvalue_usd: state.wallets.totalvalue_usd,
    totalvalue_btc: state.wallets.totalvalue_btc,
    totalmined_usd: state.wallets.totalmined_usd,
    totalmined_btc: state.wallets.totalmined_btc,
    totaltrade_usd: state.wallets.totaltrade_usd,
    totaltrade_btc: state.wallets.totaltrade_btc,
    currency: state.wallets.currency
  };
}

function mapDispatchToProps(dispath) {
  return bindActionCreators({setCurrency: actions.setCurrency}, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps )(Stats);
