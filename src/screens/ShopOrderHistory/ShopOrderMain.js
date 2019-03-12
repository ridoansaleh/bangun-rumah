import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Image, Dimensions } from 'react-native';
import { Button, Container, Content, Text, View, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import sadImage from '../../../assets/sad_face.png';
import { db } from '../../../firebase.config';
import { convertToCurrency } from '../../utils';

const { width, height } = Dimensions.get('window');

class ShopOrderScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataOrders: [],
  };

  componentDidMount() {
    this.getOrderHistoryData();
  }

  getOrderHistoryData = () => {
    let orders = [];
    const shopId = this.props.nav.navigation.getParam('id', null);
    db.collection('pemesanan')
      .where('id_toko', '==', shopId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          orders.push({
            id_pemesanan: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          isDataFetched: true,
          dataOrders: orders,
        });
      })
      .catch(error => {
        console.error("Error getting order history's data \n", error);
      });
  };

  showAllProducts = index => {
    this.setState({
      ['showMore' + index]: !this.state['showMore' + index],
    });
  };

  acceptOrder = (id, index) => {
    Alert.alert(
      'Peringatan',
      'Aksi ini tidak bisa dibatalkan. Ingin menerima pesanan ?',
      [{ text: 'OK', onPress: () => this.acceptOrderExecute(id, index) }],
      { cancelable: true }
    );
  };

  acceptOrderExecute = (id, index) => {
    let docRef = db.collection('pemesanan').doc(id);
    this.setState({ ['isAcceptedLoading' + index]: true });
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            status: 'Diterima',
          });
          this.setState({ ['isAcceptedLoading' + index]: false });
          this.getOrderHistoryData();
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error searching pemesanan with id ${id} \n`, error);
      });
  };

  rejectOrder = (id, index) => {
    Alert.alert(
      'Peringatan',
      'Aksi ini tidak bisa dibatalkan. Ingin menolak pesanan ?',
      [{ text: 'OK', onPress: () => this.rejectOrderExecute(id, index) }],
      { cancelable: true }
    );
  };

  rejectOrderExecute = (id, index) => {
    let docRef = db.collection('pemesanan').doc(id);
    this.setState({ ['isRejectedLoading' + index]: true });
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            status: 'Ditolak',
          });
          this.setState({ ['isRejectedLoading' + index]: false });
          this.getOrderHistoryData();
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error searching pemesanan with id ${id} \n`, error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Pemesanan" />
        <Content padder>
          {!this.state.isDataFetched && <Loading />}
          {this.state.isDataFetched && this.state.dataOrders.length > 0 && (
            <View>
              <View style={{ padding: 10, backgroundColor: 'green' }}>
                <Text>Riwayat Pemesanan Toko</Text>
              </View>
              {this.state.dataOrders.map((data, i) => (
                <Grid key={i} style={styles.product}>
                  <Row>
                    <Col>
                      <Image
                        source={{ uri: data.produk[0].photo }}
                        style={{ width: 0.4 * width, height: 0.25 * height }}
                      />
                    </Col>
                    <Col>
                      <Text style={{ fontWeight: 'bold' }}>{data.produk[0].nama}</Text>
                      <Text>({data.toko})</Text>
                      <Text style={{ fontSize: 12 }}>{data.waktu_pemesanan}</Text>
                      <Text style={{ marginTop: 25 }}>
                        Rp {convertToCurrency(data.produk[0].harga)}(
                        {' ' + data.produk[0].jumlah + ' ' + data.produk[0].satuan})
                      </Text>
                      <Text>{data.status}</Text>
                    </Col>
                  </Row>
                  {this.state['showMore' + (i + 1)] && data.produk.length >= 2 && (
                    <Row style={{ marginTop: 8 }}>
                      <Col>
                        <Image
                          source={{ uri: data.produk[1].photo }}
                          style={{ width: 0.4 * width, height: 0.25 * height }}
                        />
                      </Col>
                      <Col>
                        <Text style={{ fontWeight: 'bold' }}>{data.produk[1].nama}</Text>
                        <Text>({data.toko})</Text>
                        <Text style={{ fontSize: 12 }}>{data.waktu_pemesanan}</Text>
                        <Text style={{ marginTop: 25 }}>
                          Rp {convertToCurrency(data.produk[1].harga)}(
                          {' ' + data.produk[1].jumlah + ' ' + data.produk[1].satuan})
                        </Text>
                        <Text>{data.status}</Text>
                      </Col>
                    </Row>
                  )}
                  {this.state['showMore' + (i + 1)] && data.produk.length === 3 && (
                    <Row style={{ marginTop: 8 }}>
                      <Col>
                        <Image
                          source={{ uri: data.produk[2].photo }}
                          style={{ width: 0.4 * width, height: 0.25 * height }}
                        />
                      </Col>
                      <Col>
                        <Text style={{ fontWeight: 'bold' }}>{data.produk[2].nama}</Text>
                        <Text>({data.toko})</Text>
                        <Text style={{ fontSize: 12 }}>{data.waktu_pemesanan}</Text>
                        <Text style={{ marginTop: 25 }}>
                          Rp {convertToCurrency(data.produk[2].harga)}(
                          {' ' + data.produk[2].jumlah + ' ' + data.produk[2].satuan})
                        </Text>
                        <Text>{data.status}</Text>
                      </Col>
                    </Row>
                  )}
                  {data.status === 'Menunggu Konfirmasi' ? (
                    <Row>
                      <Col>
                        <Button small success onPress={() => this.acceptOrder(data.id_pemesanan)}>
                          {this.state['isAcceptedLoading' + i] ? (
                            <Spinner color="green" />
                          ) : (
                            <Text>Terima</Text>
                          )}
                        </Button>
                      </Col>
                      <Col>
                        <Button small danger onPress={() => this.rejectOrder(data.id_pemesanan)}>
                          {this.state['isRejectedLoading' + i] ? (
                            <Spinner color="green" />
                          ) : (
                            <Text>Tolak</Text>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      {data.status === 'Diterima' ? (
                        <View>
                          <Text>Pemesanan telah diterima</Text>
                        </View>
                      ) : (
                        <View>
                          <Text>Pemesanan telah ditolak</Text>
                        </View>
                      )}
                    </Row>
                  )}
                  {data.produk.length > 1 && (
                    <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                      <Button small onPress={() => this.showAllProducts(i + 1)}>
                        <Text>
                          {!this.state['showMore' + (i + 1)] ? 'Lihat semuanya' : 'Tutup'}
                        </Text>
                      </Button>
                    </Row>
                  )}
                </Grid>
              ))}
            </View>
          )}
          {this.state.isDataFetched && this.state.dataOrders.length === 0 && (
            <View style={styles.emptyContainer}>
              <Image source={sadImage} style={styles.emptyIcon} />
              <Text style={{ marginTop: 15 }}>Toko Anda belum memiliki riwayat pemesanan</Text>
              <Text>Jual produk pertama Anda dengan memperbaiki deskripsi produk, photo dsb</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  product: {
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 15,
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    height: 0.4 * height,
    marginTop: 0.2 * height,
    marginBottom: 0.2 * height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 0.4 * width,
    height: 0.2 * height,
  },
});

export default Authentication(ShopOrderScreen);
