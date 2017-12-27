import React, { Component } from 'react';


export class Percent extends Component{
    render(){
        return (
             <span className={"label label-"+(this.props.value >= 0 ? "success":"danger")}>{this.props.value}%</span>
        );
    }
}

export default Percent;
