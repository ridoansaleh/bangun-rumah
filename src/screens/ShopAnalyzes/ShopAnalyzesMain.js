import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Content } from 'native-base';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import UserVisit from './UserVIsitStatistic';
import ProductsReport from './ProductsReport';
import Selling from './SellingStatistic';
import { db } from '../../../firebase.config';
import { urls } from '../../constant';

class ShopAnalyzeScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Analisa Toko" />
        <Content>
          <UserVisit {...this.props} />
          <ProductsReport {...this.props} />
          <Selling {...this.props} />
        </Content>
      </Container>
    );
  }
}

export default Authentication(ShopAnalyzeScreen);
