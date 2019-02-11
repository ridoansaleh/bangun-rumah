import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base';
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
            <Row>
              <Promo />
            </Row>
            <Row>
              <Text style={styles.productLabel}>Produk</Text>
            </Row>
            <Row>
              <ProductList />
            </Row>
          </Grid>
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  productLabel: {
    padding: 10,
  },
});

export default HomeScreen;
