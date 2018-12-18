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

class Pools extends Component {

    handleCurrencyChange() {
        if (this.props.currency === 'BTC')
            this.props.setCurrency('USD');
        if (this.props.currency === 'USD')
            this.props.setCurrency('BTC');
    }

    componentDidMount() {
        var url = window.location.origin + '/pools';
        const resp = fetch(url).then((resp) => {
            resp.json().then((data) => {
                this.props.setPoolBalances(data);
            })
        });
    }

    render() {
        return (
            <div>
                <div className="p5">
                    <span className="topLabel">Total in Mining Pools</span>
                    <div className="totalP">
                        <Amount onClick={this.handleCurrencyChange.bind(this)} currency={this.props.currency} value_usd={this.props.total_pool} value_btc={this.props.total_pool} />
                    </div>
                </div>
                <div className="coins">
                    <Table>00
                        <thead>
                            <tr>
                                <th className="text-center" width='10%'>Coin</th>
                                <th className="text-right" width='40%'>Holdings</th>
                                <th className="text-right">Price</th>
                            </tr>
                        </thead>
                        {this.props.pool_balances.map(x => {
                            return <Coin key={x.symbol} currency={this.props.currency} coin={x} />
                        })}
                    </Table>
                    
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        pool_balances: state.wallets.pool_balances,
        wallets: state.wallets.wallets,
        total_pool: state.wallets.total_pool
    };
}

function mapDispatchToProps(dispath) {
    return bindActionCreators({ setPoolBalances: actions.setPoolBalances }, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(Pools);
