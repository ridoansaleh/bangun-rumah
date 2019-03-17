import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Content } from 'native-base';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import UserVisit from './UserVIsitStatistic';
import ProductsReport from './ProductsReport';
import Selling from './SellingStatistic';

class ShopAnalyzeScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    const shop_id = this.props.nav.navigation.getParam('id', undefined);
    return (
      <Container>
        <Header {...this.props} title="Analisa Toko" />
        <Content>
          <UserVisit {...this.props} shopId={shop_id} />
          <ProductsReport {...this.props} shopId={shop_id} />
          <Selling {...this.props} shopId={shop_id} />
        </Content>
      </Container>
    );
  }
}

export default Authentication(ShopAnalyzeScreen);
