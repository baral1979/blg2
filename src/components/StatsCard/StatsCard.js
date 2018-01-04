import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export class StatsCard extends Component{
    constructor(props) {
      super(props);

      this.state = {
        show : false
      }
    }

    handleCollapse() {
      this.setState({
        show: !this.state.show
      })
    }

    render(){

        function content(show, content) {
          return null;
          console.log('contentn', content);
          if (show === true)
            return (content)

          return null;
        }

        return (
            <div className="card card-stats">
                <div className="content">
                    <Row>
                        <Col xs={3}>
                            <div className="icon-big text-center icon-warning">
                                {this.props.bigIcon}
                            </div>
                        </Col>
                        <Col xs={9}>
                            <div className="numbers">
                                <p>{this.props.statsText}</p>
                                {this.props.statsValue}
                            </div>
                        </Col>
                    </Row>
                    <div className="footer">
                        <hr />
                        <div className="stats">
                            {this.props.statsIcon}{" "}{this.props.statsIconText}<span onClick={this.handleCollapse.bind(this)} className="pull-right"><span className={this.state.show ? 'glyphicon glyphicon-triangle-top':'glyphicon glyphicon-triangle-bottom' }></span></span>
                        </div>
                    </div>
                    {content(this.state.show, this.props.content)}
                </div>
            </div>
        );
    }
}

export default StatsCard;
