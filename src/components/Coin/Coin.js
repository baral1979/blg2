// import React, { Component } from 'react';
// import { Grid, Row, Col, Table  } from 'react-bootstrap';
// import Percent from '../Percent';
// import Amount from '../Amount';
// import StatsCard from '../StatsCard';
//
//
// export class Coin extends Component{
//
//
//     test() {
//
//       if (this.props.coin.mined_value_usd) {
//         return (<tr>
//           <td>
//             Mining Earnings
//           </td>
//             <td>{this.props.coin.mined_qty}</td>
//             <td><Amount currency={this.props.currency} value_usd={this.props.coin.mined_value_usd.toFixed(2)} value_btc={this.props.coin.mined_value_btc.toFixed(8)}/></td>
//           </tr>
//         )
//       }
//
//       return null;
//     }
//
//     changes() {
//       return ( <span>1H <Percent value={this.props.coin.percent_change_1h}/> 24H <Percent value={this.props.coin.percent_change_24h}/> 7D <Percent value={this.props.coin.percent_change_7d}/> 1 {this.props.coin.symbol}=<Amount currency={this.props.currency} value_usd={this.props.coin.value_usd.toFixed(2)} value_btc={this.props.coin.value_btc.toFixed(8)}/></span>)
//     }
//
//     price() {
//       return ( <span>1 {this.props.coin.symbol}=<Amount currency={this.props.currency} value_usd={this.props.coin.price_usd.toFixed(2)} value_btc={this.props.coin.price_btc.toFixed(8)}/></span>)
//     }
//
//     render(){
//         var coin = this.props.coin;
//         return (
//           //<tbody key={coin.id}>
//             <StatsCard key={coin.id}
//                 bigIcon={<img src={`https://files.coinmarketcap.com/static/img/coins/32x32/${coin.id}.png`}/><h5>{coin.symbol}</h5>}
//                 statsText={`${coin.balance + coin.pending} ${coin.symbol}`}
//                 statsValue={<Amount currency={this.props.currency} value_usd={coin.value_usd.toFixed(2)} value_btc={coin.value_btc.toFixed(8)}/>}
//                 statsIcon={<span className="glyphicon glyphicon-signal"/>}
//                 statsIconText={this.changes()}
//                 content={null}
//             />
//           //   <tr >
//           //     <td><img src={`https://files.coinmarketcap.com/static/img/coins/16x16/${coin.id}.png`}/></td>
//           //     <td><Amount currency={this.props.currency} value_usd={coin.value_usd.toFixed(2)} value_btc={coin.value_btc.toFixed(8)}/></td>
//           //     <td><Amount currency={this.props.currency} value_usd={coin.price_usd} value_btc={coin.price_btc}/></td>
//           //   </tr>
//           //   <tr>
//           //     <td>{coin.symbol}</td>
//           //     <td>{coin.balance + coin.pending}</td>
//           //     <td><Percent value={coin.percent_change_24h}/></td>
//           //   </tr>
//           //   {this.test()}
//           // </tbody>
//         );
//     }
// }
//
// export default Coin;
