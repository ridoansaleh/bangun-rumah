import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, ScrollView, View, StyleSheet, TouchableHighlight } from 'react-native';
import { Container, Content, Text, CheckBox, Button } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/GrandHeader';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading';
import defaultImage from '../../../assets/default-product.jpg';
import emptyResult from '../../../assets/empty_search_result.png';
import { urls } from '../../constant';
import { convertToCurrency, width, height } from '../../utils';
import { db } from '../../../firebase.config';

class ShoppingCartScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    dataCart: [],
    isDataFetched: false,
    selectedProductsID: [],
    selectedCartID: [],
    isSelectAll: false,
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
        console.warn("Error getting cart's data \n", error);
      });
  };

  checkProduct = (cartId, productId) => {
    // Cart
    if (this.state.selectedCartID.indexOf(cartId) > -1) {
      this.setState(state => {
        const data = state.selectedCartID.filter(val => val !== cartId);
        return {
          selectedCartID: data,
        };
      });
    } else {
      this.setState(state => {
        const data = state.selectedCartID.concat(cartId);
        return {
          selectedCartID: data,
        };
      });
    }
    // Product
    if (this.state.selectedProductsID.indexOf(productId) > -1) {
      this.setState(state => {
        const data = state.selectedProductsID.filter(val => val !== productId);
        return {
          selectedProductsID: data,
        };
      });
    } else {
      this.setState(state => {
        const data = state.selectedProductsID.concat(productId);
        return {
          selectedProductsID: data,
        };
      });
    }
  };

  selectAll = () => {
    let data1 = this.state.dataCart.map(d => {
      return d.id_keranjang;
    });
    let data2 = this.state.dataCart.map(d => {
      return d.id_produk;
    });
    if (this.state.isSelectAll) {
      this.setState({
        isSelectAll: false,
        selectedCartID: [],
        selectedProductsID: [],
      });
    } else {
      this.setState({
        isSelectAll: true,
        selectedCartID: data1,
        selectedProductsID: data2,
      });
    }
  };

  removeProduct = () => {
    if (this.state.selectedCartID.length > 0) {
      this.setState({
        isDataFetched: false,
      });
      for (let i = 0; i < this.state.selectedCartID.length; i++) {
        this.deleteProductFromCart(this.state.selectedCartID[i]);
        if (i === this.state.selectedCartID.length - 1) {
          this.getCartData();
        }
      }
    } else if (this.state.selectedCartID.length === 1) {
      this.setState({
        isDataFetched: false,
      });
      this.deleteProductFromCart(this.state.selectedCartID[0]);
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

  orderProducts = () => {
    const { selectedProductsID, selectedCartID, dataCart } = this.state;
    if (selectedProductsID.length > 0) {
      if (selectedProductsID.length > 3) {
        Alert.alert(
          'Info',
          'Pemesanan maksimal 3 produk pada Toko yang sama.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: true }
        );
      } else {
        this.setState({
          isDataFetched: false,
        });
        let tempProduct = dataCart.map(d => {
          if (selectedProductsID.indexOf(d.id_produk) > -1) {
            return d;
          }
        });
        let tempProductFinal = tempProduct.filter(d => d !== undefined);
        let data = tempProductFinal.map(d => {
          if (tempProductFinal[0].toko === d.toko) {
            return d;
          }
        });
        let dataFinal = data.filter(d => d !== undefined);
        this.setState({
          isDataFetched: true,
        });
        if (tempProductFinal.length === dataFinal.length) {
          this.props.nav.navigation.navigate(urls.order, {
            products: selectedProductsID,
            carts: selectedCartID,
          });
        } else {
          Alert.alert(
            'Info',
            'Pemesanan secara paralel hanya bisa dilakukan pada Toko yang sama dan maksimal 3 produk.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: true }
          );
        }
      }
    } else {
      Alert.alert(
        'Info',
        'Belum ada produk yang dipilih untuk dipesan',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
      console.log('Nothing to order');
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
        console.warn('Error removing document \n', error);
      });
  };

  goHome = () => {
    this.props.nav.navigation.navigate(urls.home);
  };

  render() {
    const { isDataFetched, dataCart, isSelectAll } = this.state;
    return (
      <Container>
        <Header
          openDrawer={() => this.props.nav.navigation.openDrawer()}
          title
          titleText="Keranjang"
          displaySearchIcon={false}
          {...this.props}
        />
        <Content>
          {!isDataFetched && <Loading />}
          {isDataFetched && dataCart.length > 0 && (
            <Grid style={{ height: height * 0.8 }}>
              <Row size={90} style={{ marginTop: 15 }}>
                <ScrollView>
                  {dataCart.map((data, i) => (
                    <Row style={{ marginBottom: 10 }} key={i}>
                      <Col size={1}>
                        <CheckBox
                          checked={this.state.selectedCartID.indexOf(data.id_keranjang) > -1}
                          onPress={() => this.checkProduct(data.id_keranjang, data.id_produk)}
                          style={{ marginTop: width * 0.2 * 0.3 }}
                        />
                      </Col>
                      <Col
                        size={2}
                        onPress={() =>
                          this.props.nav.navigation.navigate(urls.product, {
                            product_id: data.id_produk,
                          })
                        }>
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
                      <Col
                        size={5}
                        style={{ paddingLeft: 10 }}
                        onPress={() =>
                          this.props.nav.navigation.navigate(urls.product, {
                            product_id: data.id_produk,
                          })
                        }>
                        <Text>{data.nama}</Text>
                        <Text style={{ fontSize: 12 }}>({data.toko})</Text>
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
                  <CheckBox checked={isSelectAll} style={{ marginTop: 15 }} />
                </Col>
                <Col size={3}>
                  <TouchableHighlight onPress={() => this.selectAll()}>
                    <Text style={{ marginTop: 15 }}>Semua</Text>
                  </TouchableHighlight>
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
                  <Button
                    small
                    bordered
                    dark
                    style={{ marginTop: 10 }}
                    onPress={() => this.orderProducts()}>
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
