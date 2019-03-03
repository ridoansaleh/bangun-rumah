import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { Content, Text, Header, Left, Button, Icon, Title, Body, Spinner } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../components/Authentication';
import ProductPhoto from './ProductPhoto';
import ProductDescription from './ProductDescription';
import Interactions from './Interactions';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ProductMainScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    idProduct: this.props.nav.navigation.getParam('product_id', 0),
    isDataFetched: false,
    dataProduct: {},
  };

  componentDidMount() {
    this.getProduct(this.state.idProduct);
  }

  shouldComponentUpdate(nextProps) {
    const prevVal = this.props.nav.navigation.getParam('product_id', 0);
    const nextVal = nextProps.nav.navigation.getParam('product_id', 0);
    if (prevVal !== nextVal) {
      this.getProduct(nextVal);
    }
    return true;
  }

  getProduct = id => {
    if (this.state.isDataFetched) {
      this.setState({
        isDataFetched: false,
      });
    }
    db.collection('produk')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({
            isDataFetched: true,
            dataProduct: doc.data(),
          });
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error getting product with id ${this.state.idProduct} \n`, error);
      });
  };

  render() {
    let { isDataFetched, dataProduct } = this.state;
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Detil Produk</Title>
          </Body>
        </Header>
        <Content>
          <Grid style={{ height: height * 0.88 }}>
            <Row size={93}>
              <ScrollView>
                {!isDataFetched && (
                  <View style={styles.spin}>
                    <Spinner color="green" size="large" />
                  </View>
                )}
                {isDataFetched && (
                  <View>
                    <ProductPhoto data={dataProduct} />
                    <ProductDescription data={dataProduct} {...this.props.nav} />
                    <Interactions
                      data={dataProduct}
                      idProduct={this.state.idProduct}
                      {...this.props.nav}
                    />
                  </View>
                )}
              </ScrollView>
            </Row>
            <Row size={7} style={{ borderTopColor: 'black', borderTopWidth: 1 }}>
              <Col size={0.5} style={{ marginTop: 8 }}>
                <Icon name="chatboxes" style={{ paddingLeft: width * 0.05 }} />
              </Col>
              <Col size={2.5} style={{ marginTop: 8 }}>
                <Icon name="cart" style={{ paddingLeft: width * 0.05 }} />
              </Col>
              <Col size={2}>
                <Button full style={{ height: '100%' }}>
                  <Text style={{ fontSize: 13 }}>Pesan Sekarang</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Content>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    marginTop: (height * 0.75) / 2,
    marginBottom: (height * 0.75) / 2,
  },
});

export default Authentication(ProductMainScreen);
