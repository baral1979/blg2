/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import WalletList from '../../containers/walletList';
import { Grid, Row, Col } from 'react-bootstrap';
class Home extends React.Component {

  render() {
    return (
      <div className="content">
        <WalletList/>
      </div>
    );
  }
}

export default withStyles(s)(Home);
