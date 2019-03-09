import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Image,
  Picker,
  TextInput,
} from 'react-native';
import { Content, Text, Header, Left, Button, Icon, Title, Body, Spinner } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../components/Authentication';
import thankYou from '../../../assets/thank-you.png';
import { db } from '../../../firebase.config';
import { convertToCurrency } from '../../utils';
// import { urls } from '../../constant';

const { height, width } = Dimensions.get('window');

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
  };

  componentDidMount() {
    this.getProducts(this.state.productIds[0]);
  }

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
              console.log('STATE : ', this.state);
              if (this.state.step <= productIds.length) {
                console.log('step : ', step);
                console.log('productIds : ', productIds.length);
                this.getProducts(productIds[step - 1]);
              } else {
                console.log('ELSE');
                this.setState({
                  isDataFetched: true,
                });
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

  changeAddress = () => {
    // do something
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
      if (val.length > 10) {
        this.setState({ description: val, isDescriptionChanged: true, isDescriptionValid: true });
      } else {
        this.setState({ description: val, isDescriptionChanged: true, isDescriptionValid: false });
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
        console.error("Error getting searching promo's data \n", error);
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
      })
      .then(docRef => {
        console.log('Successfully make an order with id ', docRef.id);
        this.setState({ isOrderSucceed: true });
      })
      .catch(error => {
        console.error('Error making an order \n', error);
      });
  };

  confirmOrder = () => {
    if (this.state.promo) {
      this.validatePromo(this.state.promo);
    } else {
      this.completeOrder();
    }
  };

  render() {
    const { isDataFetched, data, description, promo, isOrderSucceed } = this.state;
    const options = Array.from(Array(100).keys());
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Konfirmasi Pemesanan</Title>
          </Body>
        </Header>
        <Content>
          {isOrderSucceed && (
            <View style={{ padding: 10, backgroundColor: 'yellow', justifyContent: 'center' }}>
              <Image source={thankYou} />
              <Text style={{ fontSize: 20 }}>Terimakasih</Text>
              <Text>Pemesanan Anda telah dikirimkan kepada Penjual.</Text>
              <Text>Mohon tunggu konfirmasi dari Penjual.</Text>
            </View>
          )}
          {!isDataFetched && !isOrderSucceed && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
          {isDataFetched && !isOrderSucceed && (
            <View>
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
                  <Text style={{ marginLeft: 10 }}>{this.props.user.alamat}</Text>
                </Row>
                <Row>
                  <TouchableHighlight onPress={() => this.changeAddress()}>
                    <Icon name="arrow-dropleft" />
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ marginLeft: 10 }}
                    onPress={() => this.changeAddress()}>
                    <Text>Ganti Alamat Pengiriman</Text>
                  </TouchableHighlight>
                </Row>
              </Grid>
              <View style={{ padding: 5, backgroundColor: '#FFC300', marginBottom: 15 }}>
                <Text>Total Harga : {this.calculateTotalPrice()}</Text>
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
  header: {
    marginTop: 25,
  },
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

export default Authentication(OrderMainScreen);
