import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Picker,
  TextInput,
  Keyboard,
} from 'react-native';
import { Content, Text, Button, Icon, Form, Input, Item } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../../../../components/Authentication';
import Header from '../../../../../components/PlainHeader';
import Loading from '../../../../../components/Loading';
import thankYou from '../../../../../../assets/thank-you.png';
import { db } from '../../../../../../firebase.config';
import { convertToCurrency, height, width } from '../../../../../utils';
import { urls } from '../../../../../constant';

class OrderMainScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    totalProduct1: 1,
    totalProduct2: 1,
    totalProduct3: 1,
    productIds: this.props.nav.navigation.getParam('products', null),
    data: [],
    step: 1,
    description: '',
    isDescriptionChanged: false,
    isDescriptionValid: false,
    promo: '',
    isPromoChanged: false,
    isPromoValid: false,
    idPromo: '',
    isOrderSucceed: false,
    address: this.props.user.alamat,
    isAddressWidgetShown: false,
    receiverId: '',
    margin: 0,
  };

  componentDidMount() {
    this.getProducts(this.state.productIds[0]);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({
      margin: height * 0.2,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      margin: 0,
    });
  };

  getProducts = id => {
    const { productIds, step, data } = this.state;
    db.collection('produk')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState(
            {
              data: [
                ...data,
                {
                  id_produk: doc.id,
                  ...doc.data(),
                },
              ],
              step: step + 1,
            },
            () => {
              if (this.state.step <= productIds.length) {
                this.getProducts(productIds[this.state.step - 1]);
              } else {
                this.setState({
                  isDataFetched: true,
                });
                this.getReceiverUserId();
              }
            }
          );
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error getting product with id ${id} \n`, error);
      });
  };

  changeAddress = val => {
    this.setState({
      address: val,
    });
  };

  calculateTotalPrice = () => {
    const { productIds, totalProduct1, totalProduct2, totalProduct3, data } = this.state;
    let price = 0;
    if (productIds.length === 1) {
      price = totalProduct1 * data[0].harga;
    } else if (productIds.length === 2) {
      price = totalProduct1 * data[0].harga + totalProduct2 * data[1].harga;
    } else if (productIds.length === 3) {
      price =
        totalProduct1 * data[0].harga +
        totalProduct2 * data[1].harga +
        totalProduct3 * data[2].harga;
    }
    return price;
  };

  handleChangeField = (val, name) => {
    if (name === 'description') {
      if (val) {
        if (val.length > 10) {
          this.setState({ description: val, isDescriptionChanged: true, isDescriptionValid: true });
        } else {
          this.setState({
            description: val,
            isDescriptionChanged: true,
            isDescriptionValid: false,
          });
        }
      } else {
        this.setState({ description: val, isDescriptionChanged: true, isDescriptionValid: true });
      }
    } else if (name === 'promo') {
      this.setState({ promo: val, isPromoChanged: false, isPromoValid: false });
    }
  };

  validatePromo = promoName => {
    let data = [];
    db.collection('promo')
      .where('nama', '==', promoName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_promo: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 1) {
          this.setState(
            {
              isPromoChanged: true,
              isPromoValid: true,
              idPromo: data[0].id_promo,
            },
            () => {
              this.completeOrder(data[0].jumlah_promo);
            }
          );
        } else {
          this.setState({
            isPromoChanged: true,
            isPromoValid: false,
          });
        }
      })
      .catch(error => {
        console.warn("Error searching promo's data \n", error);
      });
  };

  formatProductsData = () => {
    let result = [];
    result = this.state.data.map((d, i) => {
      return {
        id_produk: d.id_produk,
        nama: d.nama,
        photo: d.photo_produk[0],
        jumlah: this.state['totalProduct' + (i + 1)],
        satuan: d.satuan,
        harga: this.state['totalProduct' + (i + 1)] * d.harga,
      };
    });
    return result;
  };

  completeOrder = promoPercentage => {
    db.collection('pemesanan')
      .add({
        id_user: this.props.user.id,
        id_toko: this.state.data[0].id_toko,
        id_promo: this.state.idPromo,
        toko: this.state.data[0].nama_toko,
        pembeli: this.props.user.nama,
        produk: this.formatProductsData(),
        total_harga: promoPercentage
          ? (promoPercentage / 100) * this.calculateTotalPrice()
          : this.calculateTotalPrice(),
        status: 'Menunggu Konfirmasi',
        waktu_pemesanan: new Date(),
        alamat_pengiriman: this.state.address ? this.state.address : this.props.user.alamat,
      })
      .then(docRef => {
        console.log('Successfully make an order with id ', docRef.id);
        this.setState({ isOrderSucceed: true });
        const carts = this.props.nav.navigation.getParam('carts', []);
        for (let i = 0; i < carts.length; i++) {
          this.deleteProductFromCart(carts[i]);
        }
        this.sendNotification();
      })
      .catch(error => {
        console.warn('Error making an order \n', error);
      });
  };

  sendNotification = () => {
    db.collection('notifikasi')
      .add({
        penerima: this.state.receiverId,
        id_produk: this.state.data[0].id_produk,
        jenis: 'Pemesanan',
        status: 'Belum dibaca',
        teks: `${this.props.user.nama} memesan ${this.state.data[0].nama} ${this.state.data.length >
          0 && 'dan lain-lain'}`,
        waktu: new Date(),
      })
      .then(docRef => {
        console.log('Successfully send a notification');
      })
      .catch(error => {
        console.warn('Error send a notification \n', error);
      });
  };

  getReceiverUserId = () => {
    const { data } = this.state;
    let docRef = db.collection('toko').doc(data[0].id_toko);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          this.setState({
            receiverId: data.id_user,
          });
        } else {
          console.log('The shop is not found');
        }
      })
      .catch(error => {
        console.warn(`Error searching shop with id ${data[0].id_toko} \n`, error);
      });
  };

  confirmOrder = () => {
    if (this.state.promo) {
      this.validatePromo(this.state.promo);
    } else {
      this.completeOrder();
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

  render() {
    const {
      isDataFetched,
      data,
      description,
      isDescriptionChanged,
      isDescriptionValid,
      promo,
      isPromoChanged,
      isPromoValid,
      isOrderSucceed,
      address,
      isAddressWidgetShown,
    } = this.state;
    const options = Array.from(Array(100).keys());
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header {...this.props} title="Konfirmasi Pemesanan" />
        <Content>
          {isOrderSucceed && (
            <View
              style={{
                padding: 10,
                height: 0.4 * height,
                marginTop: 0.2 * height,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={thankYou} style={{ width: 0.5 * width, height: 0.18 * height }} />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 10,
                }}>{`Pemesanan Anda telah dikirimkan kepada Penjual. Mohon tunggu konfirmasi dari Penjual.`}</Text>
              <Button
                small
                style={{
                  width: 0.3 * width,
                  marginLeft: 0.35 * width,
                  marginTop: 30,
                  justifyContent: 'center',
                }}
                onPress={() => this.props.nav.navigation.navigate(urls.home)}>
                <Text>Home</Text>
              </Button>
            </View>
          )}
          {!isDataFetched && !isOrderSucceed && <Loading />}
          {isDataFetched && !isOrderSucceed && (
            <View style={{ marginBottom: this.state.margin }}>
              <Grid style={styles.userDetail}>
                <Row style={{ marginBottom: 15 }}>
                  <Col>
                    <Text>{this.props.user.nama}</Text>
                  </Col>
                  <Col style={{ justifyContent: 'flex-end' }}>
                    <Text>{this.props.user.email}</Text>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 15 }}>
                  <Icon name="locate" />
                  <Text style={{ marginLeft: 10 }}>{address}</Text>
                </Row>
                <Row>
                  <TouchableHighlight onPress={() => this.setState({ isAddressWidgetShown: true })}>
                    <Icon name="arrow-dropleft" />
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ marginLeft: 10 }}
                    onPress={() => this.setState({ isAddressWidgetShown: true })}>
                    <Text>Ganti Alamat Pengiriman</Text>
                  </TouchableHighlight>
                </Row>
                {isAddressWidgetShown && (
                  <View>
                    <Form style={{ marginBottom: 5 }}>
                      <Item regular>
                        <Input
                          value={address}
                          placeholder="Alamat"
                          onChangeText={val => this.changeAddress(val)}
                        />
                      </Item>
                    </Form>
                    <Button small onPress={() => this.setState({ isAddressWidgetShown: false })}>
                      <Text>Simpan</Text>
                    </Button>
                  </View>
                )}
              </Grid>
              <View
                style={{ margin: 10, padding: 5, backgroundColor: '#FFC300', marginBottom: 15 }}>
                <Text>Total Harga : Rp {convertToCurrency(this.calculateTotalPrice())}</Text>
              </View>
              {data.map((d, i) => (
                <Grid key={i} style={{ padding: 10 }}>
                  <Row>
                    <Col>
                      <Image
                        source={{ uri: d.photo_produk[0] }}
                        style={{ width: 0.4 * width, height: 0.17 * height }}
                      />
                    </Col>
                    <Col>
                      <Text>{d.nama}</Text>
                      <Text>
                        Rp {convertToCurrency(this.state['totalProduct' + (i + 1)] * d.harga)}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 5, marginTop: 15 }}>
                    <Text>Jumlah ({d.satuan})</Text>
                  </Row>
                  <Row>
                    <Picker
                      selectedValue={this.state['totalProduct' + (i + 1)]}
                      style={{
                        height: 40,
                        width: width - 20,
                        borderColor: 'black',
                        borderWidth: 1,
                      }}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({
                          ['totalProduct' + (i + 1)]: itemValue,
                        })
                      }>
                      {options.map((x, i) => {
                        return (
                          <Picker.Item
                            key={i}
                            label={(x + 1).toString()}
                            value={(x + 1).toString()}
                          />
                        );
                      })}
                    </Picker>
                  </Row>
                </Grid>
              ))}
              <Grid style={{ padding: 10 }}>
                <Row style={{ marginTop: 5 }}>
                  <Text>Keterangan</Text>
                </Row>
                <Row>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={val => this.handleChangeField(val, 'description')}
                    value={description}
                    style={styles.textArea}
                  />
                </Row>
                <Row>
                  {isDescriptionChanged && !isDescriptionValid && (
                    <Text style={styles.errorMessage}>
                      {'Deskripsi harus lebih dari 10 karakter atau kosong'}
                    </Text>
                  )}
                </Row>
                <Row style={{ marginTop: 5 }}>
                  <Text>Kode Promo</Text>
                </Row>
                <Row>
                  <TextInput
                    onChangeText={val => this.handleChangeField(val, 'promo')}
                    value={promo}
                    style={styles.promo}
                  />
                </Row>
                <Row>
                  {isPromoChanged && !isPromoValid && (
                    <Text style={styles.errorMessage}>{'Promo tidak valid'}</Text>
                  )}
                </Row>
                <Row style={{ marginBottom: 30 }}>
                  <Button
                    onPress={() => this.confirmOrder()}
                    style={{
                      width: width - 20,
                      justifyContent: 'center',
                    }}>
                    <Text>Pesan</Text>
                  </Button>
                </Row>
              </Grid>
            </View>
          )}
        </Content>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  userDetail: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 15,
  },
  textArea: {
    borderColor: 'black',
    borderWidth: 1,
    width: width - 20,
    marginTop: 5,
    padding: 5,
  },
  promo: {
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    width: width - 20,
    marginBottom: 15,
    padding: 5,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
    marginBottom: 10,
  },
});

export default Authentication(OrderMainScreen);
