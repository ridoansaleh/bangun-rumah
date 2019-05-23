import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Content, Text, Button, Icon } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../../../components/Authentication';
import Header from '../../../../components/PlainHeader';
import Loading from '../../../../components/Loading';
import ProductPhoto from './ProductPhoto';
import ProductDescription from './ProductDescription';
import Interactions from './Interactions';
import CartModal from './CartModal';
import { urls } from '../../../../constant';
import { width, height } from '../../../../utils';
import { db } from '../../../../../firebase.config';

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
    shopId: '',
    shopName: '',
    shopPhoto: '',
    shopOwnership: false,
    isModalVisible: false,
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
            shopPhoto: data.photo,
          });
        } else {
          this.setState({
            isDataFetched: true,
            shopOwnership: false,
            shopPhoto: data.photo,
          });
        }
      })
      .catch(error => {
        console.warn("Error getting shop's data \n", error);
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
          const res = doc.data();
          this.setState(
            {
              dataProduct: {
                id_produk: doc.id,
                shopId: res.id_toko,
                shopName: res.nama_toko,
                ...res,
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

  checkProductStatus = () => {
    if (this.props.isLogin) {
      this.checkProductInCart();
    } else {
      this.props.nav.navigation.navigate(urls.login);
    }
  };

  hideModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  checkProductInCart = () => {
    let data = [];
    db.collection('keranjang')
      .where('id_user', '==', this.props.user.id)
      .where('id_produk', '==', this.state.dataProduct.id_produk)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        if (data.length === 1) {
          Alert.alert(
            'Info',
            'Produk ini sudah pernah Anda tambahkan ke keranjang',
            [{ text: 'OK', onPress: () => console.log('Close alert dialog') }],
            { cancelable: true }
          );
        } else {
          this.setState({
            isModalVisible: true,
          });
        }
      })
      .catch(error => {
        console.warn("Error searching cart's data \n", error);
      });
  };

  editProduct = data => {
    this.props.nav.navigation.navigate(urls.product_form, {
      product_id: data.id_produk,
      shop_name: data.nama_toko,
    });
  };

  orderProduct = () => {
    this.props.nav.navigation.navigate(urls.order, {
      products: [this.state.dataProduct.id_produk],
    });
  };

  openShopChatting = () => {
    const { dataProduct } = this.state;
    this.props.nav.navigation.navigate(urls.message_detail, {
      shopId: dataProduct.shopId,
      shop: {
        photo: this.state.shopPhoto,
        nama_toko: dataProduct.nama_toko,
      },
      userId: this.props.user.id,
      chatType: 'userChatting',
      replyId: dataProduct.shopId,
      friendName: dataProduct.shopName,
    });
  };

  render() {
    let { isDataFetched, dataProduct, shopOwnership, isModalVisible } = this.state;
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header {...this.props} title="Detil Produk" />
        <Content>
          <Grid style={{ height: height * 0.88 }}>
            <Row size={93}>
              <ScrollView>
                {!isDataFetched && <Loading />}
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
                  <Button style={styles.btnEdit} onPress={() => this.editProduct(dataProduct)}>
                    <Text style={{ fontSize: 13 }}>Edit</Text>
                  </Button>
                </Row>
              ) : (
                <Row size={7} style={{ borderTopColor: 'black', borderTopWidth: 1 }}>
                  <Col size={0.5} style={{ marginTop: 8 }}>
                    <Icon
                      name="chatboxes"
                      style={{ paddingLeft: width * 0.05 }}
                      onPress={() => this.openShopChatting()}
                    />
                  </Col>
                  <Col size={2.5} style={{ marginTop: 8 }}>
                    <Icon
                      name="cart"
                      style={{ paddingLeft: width * 0.05 }}
                      onPress={() => this.checkProductStatus()}
                    />
                  </Col>
                  <Col size={2}>
                    <Button full style={{ height: '100%' }} onPress={() => this.orderProduct()}>
                      <Text style={{ fontSize: 13 }}>Pesan Sekarang</Text>
                    </Button>
                  </Col>
                </Row>
              ))}
            <CartModal
              isVisible={isModalVisible}
              product={dataProduct}
              closeModal={this.hideModal}
              {...this.props}
            />
          </Grid>
        </Content>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  btnEdit: {
    height: '100%',
    width: '95%',
    justifyContent: 'center',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
});

export default Authentication(ProductMainScreen);
