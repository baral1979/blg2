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

class Mining extends Component {

  handleCurrencyChange() {
    if (this.props.currency === 'BTC')
      this.props.setCurrency('USD');
    if (this.props.currency === 'USD')
      this.props.setCurrency('BTC');
  }

  componentDidMount() {
    var url = window.location.origin + '/mining';
    const resp = fetch(url).then((resp) => {
      resp.json().then((data) => {
        this.props.setMining(data);
      })
    });
  }

  createMiningList() {

      if (!this.props.mining)
        return null;

      var mining = this.props.mining.filter(m =>
        {
          console.log('m', m.getdashboarddata.data);
          return m.getdashboarddata && m.getdashboarddata.data && m.getdashboarddata.data.raw
              && m.getdashboarddata.data.raw.personal.hashrate > 0});




    return mining.map(m => {
      var data = m.getdashboarddata.data;
      console.log('mining data', data);
      var img = this.props.wallets.filter(w => { return w.symbol === data.pool.info.currency}).map(w => {
        return (<img src={`https://files.coinmarketcap.com/static/img/coins/16x16/${w.id}.png`}/>);
      })
        return  (<StatsCard
            bigIcon={<span className="glyphicon glyphicon-dashboard"/>}
            statsText={data.pool.info.currency}
            statsValue={data.raw.personal.hashrate + " kSol/sec"}
            statsIcon={img && img.length > 0 ? img[0] : null}
            statsIconText={`C: ${data.balance.confirmed}  U: ${data.balance.unconfirmed} `}
        />);
      });

  }

  render() {
    return (
      <div>
      <Grid fluid>

        <Row>
          {this.createMiningList()}
        </Row>


      </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mining: state.wallets.mining,
    wallets: state.wallets.wallets
  };
}

function mapDispatchToProps(dispath) {
  return bindActionCreators({setMining: actions.setMining }, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(Mining);
