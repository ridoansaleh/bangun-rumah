import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Header from '../../components/Header';
import Promo from './Promo';
import ProductList from './ProductList';
import Footer from '../../components/Footer';

class HomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header openDrawer={() => this.props.navigation.openDrawer()} />
        <Content>
          <Grid>
            <Row size={1}>
              <Promo />
            </Row>
            <Row size={3}>
              <ProductList />
            </Row>
          </Grid>
        </Content>
        <Footer />
      </Container>
    );
  }
}

export default HomeScreen;
