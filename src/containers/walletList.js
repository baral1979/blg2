import React, { Component } from 'React';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { addCoin } from '../actions';
class WalletList extends Component {

  componentDidMount() {
    alert('yo');
    this.props.addCoin({ 'symbol': 'BTC', value: 100});
  }

  createWalletList() {
    return this.props.wallets.map((wallet) => {
      return (<li key={wallet.symbol}>{wallet.symbol}</li>)
    })
  }

  getTotal() {
    var total = 0;
    for (var i = 0; i < this.props.wallets.length; i++) {
      total += this.props.wallets[i].value;
    }

    return total;
  }

  render() {
    return (
      <div>
      <h3>Wallets ({this.getTotal()} USD)</h3>
      <ul>
        {this.createWalletList()}
      </ul>
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
  return bindActionCreators({addCoin: addCoin}, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(WalletList);
