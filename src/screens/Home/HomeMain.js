import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import Header from '../../components/Header';
import Promo from './Promo';
import ProductList from './ProductList';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import { urls } from '../../constant';

class HomeScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLogin: Object.keys(props.user).length > 0,
    };
  }

  render() {
    return (
      <Container>
        <Header
          openDrawer={() => this.props.nav.navigation.openDrawer()}
          isLogin={this.state.isLogin}
          search
        />
        <Content>
          <Grid>
            <Row>
              <Promo />
            </Row>
            <Row>
              <Text style={styles.productLabel}>Produk</Text>
            </Row>
            <Row>
              <ProductList {...this.props.nav} />
            </Row>
          </Grid>
        </Content>
        <Footer {...this.props.nav} pageActive={urls.home} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  productLabel: {
    padding: 10,
  },
});

export default Authentication(HomeScreen);