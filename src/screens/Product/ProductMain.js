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
import { urls } from '../../constant';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ProductMainScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
    isLogin: PropTypes.bool,
  };

  state = {
    idProduct: this.props.nav.navigation.getParam('product_id', 0),
    isDataFetched: false,
    dataProduct: {},
    shopOwnership: false,
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

  checkShopOwnership = () => {
    let data = [];
    db.collection('toko')
      .where('id_user', '==', this.props.user.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_toko: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 1) {
          this.setState({
            isDataFetched: true,
            shopOwnership: true,
          });
        } else {
          this.setState({
            isDataFetched: true,
            shopOwnership: false,
          });
        }
      })
      .catch(error => {
        console.error("Error getting shop's data \n", error);
      });
  };

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
          this.setState(
            {
              dataProduct: {
                id_produk: doc.id,
                ...doc.data(),
              },
            },
            () => {
              if (this.props.isLogin) {
                this.checkShopOwnership();
              } else {
                this.setState({
                  isDataFetched: true,
                  shopOwnership: false,
                });
              }
            }
          );
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error getting product with id ${this.state.idProduct} \n`, error);
      });
  };

  editProduct = data => {
    this.props.nav.navigation.navigate(urls.product_form, {
      product_id: data.id_produk,
      shop_name: data.nama_toko,
    });
  };

  render() {
    let { isDataFetched, dataProduct, shopOwnership } = this.state;
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
            {isDataFetched &&
              (shopOwnership ? (
                <Row size={7}>
                  <Button
                    style={{
                      height: '100%',
                      width: '95%',
                      justifyContent: 'center',
                      marginLeft: '2.5%',
                      marginRight: '2.5%',
                    }}
                    onPress={() => this.editProduct(dataProduct)}>
                    <Text style={{ fontSize: 13 }}>Edit</Text>
                  </Button>
                </Row>
              ) : (
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
              ))}
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
