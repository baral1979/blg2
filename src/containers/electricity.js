import React, { Component } from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions';
import { Grid, Row, Col, Table } from 'react-bootstrap';

class Electricity extends Component {

    handleCurrencyChange() {
        if (this.props.currency === 'BTC')
            this.props.setCurrency('USD');
        if (this.props.currency === 'USD')
            this.props.setCurrency('BTC');
    }

    componentDidMount() {
        var url = window.location.origin + '/electricity';
        const resp = fetch(url).then((resp) => {
            resp.json().then((data) => {
                this.props.setElectricity(data);
            })
        });
    }

    render() {

        function Total(props) {
            if (props === null || props.data === null || props.data.length === 0)
                return null;
            var sum = 0, watts = 0;

            for (let index = 0; index < props.data.length; index++) {
                const element = props.data[index];
                sum += element.price;
                watts += element.amount;
                
            }
            // const reducer = (accumulator, currentValue) => accumulator.price + currentValue.price;
            // var sum = props.data.reduce(reducer);
            return (<span>{watts} kWh <span className="label label-default">${sum.toFixed(2)}</span></span>)
        }

        return (
            <div>
                <div className="p5">
                    <span className="topLabel">Total Electricity</span>
                    <div className="totalP">
                        <Total data={this.props.electricity} />
                    </div>
                </div>
                <div className="coins">
                    <Table>
                        <thead>
                            <tr>
                                <th className="text-center" width='50%'>Period</th>
                                <th className="text-right" width='20%'>kWh</th>
                                <th className="text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.electricity.map(x => {
                                return (
                                    <tr>
                                        <td className="text-center">{x.from} - {x.to}</td>
                                        <td className="text-right">{x.amount}</td>
                                        <td className="text-right">${x.price}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        electricity: state.wallets.electricity,
    };
}

function mapDispatchToProps(dispath) {
    return bindActionCreators({ setElectricity: actions.setElectricity }, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(Electricity);
