import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, Dimensions, ScrollView, View, StyleSheet } from 'react-native';
import { Container, Content, Text, CheckBox, Button, Spinner } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import defaultImage from '../../../assets/default-product.jpg';
import emptyResult from '../../../assets/empty_search_result.png';
import { urls } from '../../constant';
import { convertToCurrency } from '../../utils';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ShoppingCartScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    dataCart: [],
    isDataFetched: false,
    selectedProductsID: [],
  };

  componentDidMount() {
    this.getCartData();
  }

  getCartData = () => {
    let products = [];
    db.collection('keranjang')
      .where('id_user', '==', this.props.user.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          products.push({
            id_keranjang: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          isDataFetched: true,
          dataCart: products,
        });
      })
      .catch(error => {
        console.error("Error getting cart's data \n", error);
      });
  };

  checkProduct = id => {
    if (this.state.selectedProductsID.indexOf(id) > -1) {
      this.setState(state => {
        const data = state.selectedProductsID.filter(val => val !== id);
        return {
          selectedProductsID: data,
        };
      });
    } else {
      this.setState(state => {
        const data = state.selectedProductsID.concat(id);
        return {
          selectedProductsID: data,
        };
      });
    }
  };

  removeProduct = () => {
    if (this.state.selectedProductsID.length > 1) {
      this.setState({
        isDataFetched: false,
      });
      for (let i = 0; i < this.state.selectedProductsID.length; i++) {
        this.deleteProductFromCart(this.state.selectedProductsID[i]);
        if (i === this.state.selectedProductsID.length - 1) {
          this.getCartData();
        }
      }
    } else if (this.state.selectedProductsID.length == 1) {
      this.setState({
        isDataFetched: false,
      });
      this.deleteProductFromCart(this.state.selectedProductsID[0]);
      this.getCartData();
    } else {
      Alert.alert(
        'Info',
        'Belum ada produk yang dipilih untuk dihapus',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
      console.log('Nothing to delete');
    }
  };

  deleteProductFromCart = id => {
    db.collection('keranjang')
      .doc(id)
      .delete()
      .then(function() {
        console.log('Document successfully deleted!');
      })
      .catch(function(error) {
        console.error('Error removing document \n', error);
      });
  };

  goHome = () => {
    this.props.nav.navigation.navigate(urls.home);
  };

  render() {
    const { isDataFetched, dataCart } = this.state;
    return (
      <Container>
        <Header
          openDrawer={() => this.props.nav.navigation.openDrawer()}
          title
          titleText="Keranjang"
          search={false}
        />
        <Content>
          {!isDataFetched && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
          {isDataFetched && dataCart.length > 0 && (
            <Grid style={{ height: height * 0.8 }}>
              <Row size={90} style={{ marginTop: 15 }}>
                <ScrollView>
                  {dataCart.map((data, i) => (
                    <Row style={{ marginBottom: 10 }} key={i}>
                      <Col size={1}>
                        <CheckBox
                          checked={this.state.selectedProductsID.indexOf(data.id_keranjang) > -1}
                          onPress={() => this.checkProduct(data.id_keranjang)}
                          style={{ marginTop: width * 0.2 * 0.3 }}
                        />
                      </Col>
                      <Col
                        size={2}
                        onPress={() => this.props.nav.navigation.navigate(urls.product)}>
                        {data.photo === '' && (
                          <Image
                            source={defaultImage}
                            style={{ width: width * 0.2, height: height * 0.1 }}
                          />
                        )}
                        {data.photo !== '' && (
                          <Image
                            source={{ uri: data.photo }}
                            style={{ width: width * 0.2, height: height * 0.1 }}
                          />
                        )}
                      </Col>
                      <Col size={5} style={{ paddingLeft: 10 }}>
                        <Text>{data.nama}</Text>
                        <Text style={{ fontSize: 12 }}>
                          Rp {convertToCurrency(data.total_harga)}
                        </Text>
                        <Text style={{ position: 'absolute', bottom: 0, left: 10, fontSize: 12 }}>
                          {data.promo && `Diskon ${data.promo}`}
                        </Text>
                      </Col>
                      <Col size={2}>
                        <Text style={{ marginTop: width * 0.2 * 0.3, fontSize: 12 }}>
                          {data.jumlah} {data.satuan}
                        </Text>
                      </Col>
                    </Row>
                  ))}
                </ScrollView>
              </Row>
              <Row
                size={10}
                style={{
                  backgroundColor: 'white',
                  borderColor: 'black',
                  borderTopWidth: 1,
                }}>
                <Col size={1}>
                  <CheckBox checked={false} style={{ marginTop: 15 }} />
                </Col>
                <Col size={3}>
                  <Text style={{ marginTop: 15 }}>Semua</Text>
                </Col>
                <Col size={3}>
                  <Button
                    small
                    bordered
                    dark
                    onPress={this.removeProduct}
                    style={{ position: 'absolute', right: 5, marginTop: 10 }}>
                    <Text>Hapus</Text>
                  </Button>
                </Col>
                <Col size={3}>
                  <Button small bordered dark style={{ marginTop: 10 }}>
                    <Text>Pesan</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          )}
          {isDataFetched && dataCart.length === 0 && (
            <View style={styles.emptyContainer}>
              <Image source={emptyResult} style={styles.emptyLogo} />
              <Button small bordered dark style={styles.emptyBtn} onPress={this.goHome}>
                <Text>Belanja</Text>
              </Button>
            </View>
          )}
        </Content>
        <Footer {...this.props.nav} pageActive={urls.cart} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    marginTop: (height * 0.75) / 2,
    marginBottom: (height * 0.75) / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.5,
    marginTop: height * 0.15,
  },
  emptyLogo: {
    width: width * 0.5,
    height: height * 0.3,
  },
  emptyBtn: {
    width: width * 0.3,
    marginLeft: width * 0.35,
    marginRight: width * 0.35,
    justifyContent: 'center',
  },
});

export default Authentication(ShoppingCartScreen);
