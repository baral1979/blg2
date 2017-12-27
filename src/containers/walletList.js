import React, { Component } from 'React';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import actions from '../actions';
import StatsCard from '../components/StatsCard';
import Percent from '../components/Percent';
import Card from '../components/Card';
import { Grid, Row, Col, Table  } from 'react-bootstrap';
import ChartistGraph from 'react-chartist';

class WalletList extends Component {

  componentDidMount() {
    var url = window.location.origin + '/test';
    const resp = fetch(url).then((resp) => {
      console.log(resp);

      resp.json().then((data) => {
        console.log('data', data);
        this.props.setCoins(data);

      })
    });
  }

  createWalletList() {
      return (
            <Card
                title="Wallets"
                category="Updated just now"
                ctTableFullWidth ctTableResponsive
                content={
                    <Table striped hover>
                        <thead>
                            <tr>
                              <th/>
                              <th>Coin</th>
                              <th>$ USD</th>
                              <th><span className="glyphicon glyphicon-bitcoin"/></th>
                              <th>1H</th>
                              <th>24H</th>
                              <th>W</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.wallets.sort((a,b) => {
                                  if (a.value_usd < b.value_usd)
                                    return 1;
                                  if (a.value_usd > b.value_usd)
                                    return -1;
                                  return 0;
                                }).map((wallet) => {
                                    return (
                                        <tr key={wallet.id}>
                                          <td><img src={`https://files.coinmarketcap.com/static/img/coins/16x16/${wallet.id}.png`}/></td>
                                          <td>{wallet.symbol}</td>
                                          <td>${wallet.value_usd.toFixed(2)}</td>
                                          <td>{wallet.value_btc.toFixed(8)}</td>
                                          <td><Percent value={wallet.percent_change_1h}/></td>
                                            <td><Percent value={wallet.percent_change_24h}/></td>
                                              <td><Percent value={wallet.percent_change_7d}/></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                }
            />
      )
  }

  createWalletDistribution() {
    var dataPie = {
      labels: [],
      series: []
    };

    var total = this.getTotal_BTC();
    for (var i = 0; i < this.props.wallets.length; i++) {
      var w = this.props.wallets[i];
      dataPie.labels.push(w.symbol);
      dataPie.series.push(w.value_btc/total)
    }

    var options = {
    labelInterpolationFnc: function(value) {
      return value[0]
    }
  };

  var responsiveOptions = [
  ['screen and (min-width: 640px)', {
    chartPadding: 30,
    labelOffset: 100,
    labelDirection: 'explode',
    labelInterpolationFnc: function(value) {
      return value;
    }
  }],
  ['screen and (min-width: 1024px)', {
    labelOffset: 80,
    chartPadding: 20
  }]
];
    return (
      <Card
          statsIcon="fa fa-clock-o"
          title="Email Statistics"
          category="Last Campaign Performance"
          stats="Campaign sent 2 days ago"
          content={
              <div id="chartPreferences" className="ct-chart ct-perfect-fourth">
                  <ChartistGraph data={dataPie} type="Pie" options={options} responsiveOptions={responsiveOptions}/>
              </div>
          }
      />
    );
  }

  createLegend(json){
      var legend = [];
      for(var i = 0; i < json["names"].length; i++){
          var type = "fa fa-circle text-"+json["types"][i];
          legend.push(
              <i className={type} key={i}></i>
          );
          legend.push(" ");
          legend.push(
              json["names"][i]
          );
      }
      return legend;
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
        <StatsCard
           bigIcon={<span className="glyphicon glyphicon-briefcase"/>}
           statsText="Estimated value (USD)"
           statsValue={`$${this.getTotal_USD().toFixed(2)}`}
           statsIcon={<img src='https://files.coinmarketcap.com/static/img/coins/16x16/bitcoin.png'/>}
           statsIconText={this.getTotal_BTC().toFixed(8)}/>
        </Row>
        <Row>
          {this.createWalletList()}
        </Row>
        <Row>
          {this.createWalletDistribution()}
        </Row>

      </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    wallets: state.wallets.wallets
  };
}

function mapDispatchToProps(dispath) {
  return bindActionCreators({setCoins: actions.setCoins}, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(WalletList);
