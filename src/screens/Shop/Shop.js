import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Icon, Text, View, Button } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import emptyResult from '../../../assets/empty_search_result.png';
import { urls } from '../../constant';
import { convertToCurrency } from '../../utils';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');
const numColumns = 2;
const halfWidth = width / numColumns;

class Shop extends Component {
  static propTypes = {
    nav: PropTypes.object,
    shop: PropTypes.object,
    products: PropTypes.array,
    isUserOwnedThisShop: PropTypes.bool,
    getShopProducts: PropTypes.func,
  };

  handleDeleteProduct = id => {
    let data = [];
    db.collection('pemesanan')
      .where('id_produk', '==', id)
      .where('status', '==', 'Menunggu Konfirmasi')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_pemesanan: doc.id,
            ...doc.data(),
          });
        });
        if (data.length > 0) {
          Alert.alert(
            'Peringatan',
            'Anda tidak bisa menghapus produk yang masih ada pemesanan.' +
              'Segera terima atau tolak pemesanan tersebut.',
            [{ text: 'OK', onPress: () => console.log('Close the alert') }],
            { cancelable: true }
          );
        } else {
          Alert.alert(
            'Peringatan',
            'Apakah Anda yakin ingin menghapus produk ini ?',
            [{ text: 'OK', onPress: () => this.deleteProduct(id) }],
            { cancelable: true }
          );
        }
      })
      .catch(error => {
        console.error("Error getting pemesanan's data \n", error);
      });
  };

  deleteProduct = id => {
    db.collection('produk')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Product successfully deleted!');
        this.props.getShopProducts([{ id_toko: this.props.shop.id_toko }], true);
      })
      .catch(error => {
        console.error('Error deleting product \n', error);
      });
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Grid>
          <Row>
            <Image
              source={{ uri: this.props.shop.photo }}
              style={{ width: width - 20, height: 0.3 * height }}
            />
          </Row>
          <Row style={{ marginTop: 5, marginBottom: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>{this.props.shop.nama}</Text>
          </Row>
          <Row style={{ marginBottom: 15 }}>
            <Text>{this.props.shop.deskripsi}</Text>
          </Row>
          <Row style={{ borderColor: 'black', borderWidth: 1, padding: 5 }}>
            <Col size={19}>
              <Text>Daftar Produk</Text>
            </Col>
            <Col size={1}>
              {this.props.isUserOwnedThisShop && (
                <TouchableOpacity
                  onPress={() =>
                    this.props.nav.navigation.navigate(urls.product_form, {
                      shop_id: this.props.shop.id_toko,
                      shop_name: this.props.shop.nama,
                    })
                  }>
                  <Icon name="add" style={{ fontSize: 23 }} />
                </TouchableOpacity>
              )}
            </Col>
          </Row>
          <Row>
            {this.props.products.length > 0 && (
              <FlatList
                data={this.props.products}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.nav.navigation.navigate(urls.product, {
                        product_id: item.id_produk,
                      })
                    }>
                    <View style={styles.itemContainer}>
                      <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: item.photo_produk[0] }} style={styles.productImage} />
                        <Text>{item.nama}</Text>
                        <StarRating
                          disabled
                          maxStars={5}
                          rating={parseInt(item.bintang, 10)}
                          starSize={20}
                          fullStarColor={'gold'}
                        />
                        <Text>Rp {convertToCurrency(parseInt(item.harga, 10))}</Text>
                      </View>
                      <Grid style={{ marginTop: 15 }}>
                        {this.props.isUserOwnedThisShop ? (
                          <Row style={{ marginLeft: 0.1 * (0.5 * width - 20) }}>
                            <Col>
                              <Button
                                small
                                bordered
                                danger
                                onPress={() => this.handleDeleteProduct(item.id_produk)}>
                                <Text style={{ fontSize: 13 }}>Hapus</Text>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                small
                                bordered
                                warning
                                onPress={() =>
                                  this.props.nav.navigation.navigate(urls.product_form, {
                                    product_id: item.id_produk,
                                    shop_name: item.nama_toko,
                                  })
                                }>
                                <Text style={{ fontSize: 13 }}>Edit</Text>
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Button small style={{ width: '90%', justifyContent: 'center' }}>
                              <Text>Pesan</Text>
                            </Button>
                          </Row>
                        )}
                      </Grid>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={item => item.id_produk}
                numColumns={numColumns}
              />
            )}
            {this.props.products.length === 0 && (
              <View style={styles.emptyContainer}>
                <Image source={emptyResult} style={styles.emptyLogo} />
                <Text style={styles.emptyText}>Belum Ada Produk</Text>
              </View>
            )}
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  itemContainer: {
    // backgroundColor: 'yellow',
    width: halfWidth - 10,
    height: 0.4 * height,
    // margin: 3,
    // alignItems: 'center',
  },
  productImage: {
    width: halfWidth * 0.7,
    height: halfWidth * 0.6,
    marginTop: 15,
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: width * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  emptyText: {
    fontSize: 15,
  },
});

export default Shop;
