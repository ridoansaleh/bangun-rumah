import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, View, Dimensions, StyleSheet } from 'react-native';
import { Button, Text, Spinner, Form, Item, Input, Label } from 'native-base';
import Modal from 'react-native-modal';
import { db } from '../../../firebase.config';

const { height } = Dimensions.get('window');

class CartModal extends Component {
  static propTypes = {
    user: PropTypes.object,
    product: PropTypes.object,
    isVisible: PropTypes.bool,
    closeModal: PropTypes.func,
  };

  state = {
    promoCode: '',
    isPromoChanged: false,
    isPromoValid: false,
    totalProduct: '',
    isTotalChanged: false,
    isTotalValid: false,
    isLoading: false,
  };

  handleChangeField = (val, name) => {
    if (name === 'promo') {
      if (val !== '') {
        this.setState({
          promoCode: val,
        });
      } else {
        this.setState({
          promoCode: '',
          isPromoChanged: true,
          isPromoValid: true,
        });
      }
    } else if (name === 'total_product') {
      if (/^[0-9]+$/.test(val)) {
        if (val !== 0) {
          this.setState({ totalProduct: val, isTotalChanged: true, isTotalValid: true });
        } else {
          this.setState({ totalProduct: val, isTotalChanged: true, isTotalValid: false });
        }
      } else {
        this.setState({ totalProduct: val, isTotalChanged: true, isTotalValid: false });
      }
    }
  };

  validateForm = () => {
    if (this.state.isTotalValid) {
      return true;
    }
    return false;
  };

  validatePromo = promoName => {
    const { totalProduct } = this.state;
    const { product, user } = this.props;
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
              isLoading: false,
              isPromoChanged: true,
              isPromoValid: true,
            },
            () => {
              db.collection('keranjang')
                .add({
                  id_produk: product.id_produk,
                  id_promo: data[0].id_promo,
                  id_user: user.id,
                  jumlah: totalProduct,
                  nama: product.nama,
                  photo: product.photo_produk[0],
                  promo: '',
                  satuan: product.satuan,
                  total_harga: data[0].jumlah_promo * (totalProduct * parseInt(product.harga, 10)),
                })
                .then(docRef => {
                  console.log('Successfully add product to cart with id ', docRef.id);
                  Alert.alert(
                    'Info',
                    'Berhasil menambahkan produk ke Keranjang',
                    [{ text: 'OK', onPress: () => console.log('Close alert dialog') }],
                    { cancelable: true }
                  );
                })
                .catch(error => {
                  console.error('Error adding data to keranjang \n', error);
                });
            }
          );
        } else {
          this.setState({
            isLoading: false,
            isPromoChanged: true,
            isPromoValid: false,
          });
        }
      })
      .catch(error => {
        console.error("Error searching promo's data \n", error);
      });
  };

  addProductToCart = () => {
    const { promoCode, totalProduct } = this.state;
    const { product } = this.props;
    this.setState({ isLoading: true });
    if (promoCode) {
      this.validatePromo(promoCode);
    } else {
      db.collection('keranjang')
        .add({
          id_produk: product.id_produk,
          id_promo: '',
          id_user: this.props.user.id,
          jumlah: totalProduct,
          nama: product.nama,
          photo: product.photo_produk[0],
          toko: product.nama_toko,
          promo: '',
          satuan: product.satuan,
          total_harga: totalProduct * parseInt(product.harga, 10),
        })
        .then(docRef => {
          console.log('Successfully add product to cart with id ', docRef.id);
          this.setState({ isLoading: false });
          Alert.alert(
            'Info',
            'Berhasil menambahkan produk ke Keranjang',
            [{ text: 'OK', onPress: () => console.log('Close alert dialog') }],
            { cancelable: true }
          );
        })
        .catch(error => {
          console.error('Error adding data to keranjang \n', error);
        });
    }
  };

  render() {
    let {
      promoCode,
      isPromoChanged,
      isPromoValid,
      totalProduct,
      isTotalChanged,
      isTotalValid,
      isLoading,
    } = this.state;

    return (
      <View>
        <Modal
          isVisible={this.props.isVisible}
          onBackdropPress={() => this.props.closeModal()}
          style={styles.modal}>
          <View>
            <Form style={styles.form}>
              <Item stackedLabel error={isPromoChanged && !isPromoValid}>
                <Label>Kode Promo</Label>
                <Input
                  onChangeText={val => this.handleChangeField(val, 'promo')}
                  value={promoCode}
                />
              </Item>
              {isPromoChanged && !isPromoValid && (
                <Item style={styles.errorBox}>
                  <Text style={styles.errorMessage}>{'Kode promo tidak valid'}</Text>
                </Item>
              )}
              <Item stackedLabel last error={isTotalChanged && !isTotalValid}>
                <Label>Jumlah Produk</Label>
                <Input
                  onChangeText={val => this.handleChangeField(val, 'total_product')}
                  value={totalProduct}
                />
              </Item>
              {isTotalChanged && !isTotalValid && (
                <Item style={styles.errorBox}>
                  <Text style={styles.errorMessage}>
                    {'Jumlah tidak boleh kosong dan hanya bisa angka'}
                  </Text>
                </Item>
              )}
              {this.validateForm() ? (
                <Button style={styles.btnAddToCart} onPress={() => this.addProductToCart()}>
                  {isLoading ? <Spinner color="white" /> : <Text>Tambahkan ke Keranjang</Text>}
                </Button>
              ) : (
                <Button disabled style={styles.btnAddToCart}>
                  <Text>Tambahkan ke Keranjang</Text>
                </Button>
              )}
            </Form>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 0,
    height: 0.35 * height,
    width: '100%',
    backgroundColor: 'white',
    margin: 0,
    position: 'absolute',
    bottom: 0,
  },
  form: {
    width: '95%',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  errorBox: {
    borderBottomWidth: 0,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
  },
  btnAddToCart: {
    width: '100%',
    marginTop: 15,
    justifyContent: 'center',
  },
});

export default CartModal;
