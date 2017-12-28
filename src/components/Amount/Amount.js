import React, { Component } from 'react';


export class Amount extends Component{
    handleClick(props) {
      if (props.onClick)
        props.onClick();
    }

    render(){
        switch (this.props.currency) {
          case 'BTC':
            return <span onClick={this.handleClick.bind(this, this.props)}><span className='glyphicon glyphicon-bitcoin'></span>{this.props.value_btc}</span>
            break;
          default:
            return <span onClick={this.handleClick.bind(this, this.props)}><span className='glyphicon glyphicon-usd'></span>{this.props.value_usd}</span>
        }

    }
}

export default Amount;
