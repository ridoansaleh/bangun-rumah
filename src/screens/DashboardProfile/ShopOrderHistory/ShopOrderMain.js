import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Image } from 'react-native';
import { Button, Container, Content, Text, View, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import dayjs from 'dayjs';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import sadImage from '../../../../assets/sad_face.png';
import { db } from '../../../../firebase.config';
import { convertToCurrency, width, height } from '../../../utils';

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

  acceptOrder = (data, index) => {
    Alert.alert(
      'Peringatan',
      'Aksi ini tidak bisa dibatalkan. Ingin menerima pesanan ?',
      [{ text: 'OK', onPress: () => this.acceptOrderExecute(data, index) }],
      { cancelable: true }
    );
  };

  acceptOrderExecute = (data, index) => {
    let docRef = db.collection('pemesanan').doc(data.id_pemesanan);
    this.setState({ ['isAcceptedLoading' + index]: true });
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            status: 'Diterima',
          });
          const data = doc.data();
          this.setState({ ['isAcceptedLoading' + index]: false });
          this.getOrderHistoryData();
          this.setProductsSellStats(data);
          this.sendNotification(data, 'menerima');
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error searching pemesanan with id ${data.id_pemesanan} \n`, error);
      });
  };

  sendNotification = (data, word) => {
    db.collection('notifikasi')
      .add({
        penerima: data.id_user,
        id_produk: data.produk[0].id_produk,
        jenis: 'Pesanan',
        status: 'Belum dibaca',
        teks: `${this.props.user.nama} telah ${word} pesanan Anda`,
        waktu: new Date(),
      })
      .then(docRef => {
        console.log('Successfully send a notification');
      })
      .catch(error => {
        console.error('Error send a notification \n', error);
      });
  };

  setProductsSellStats = data => {
    for (let i = 0; i < data.produk.length; i++) {
      const id = data.produk[i].id_produk;
      let docRef = db.collection('produk').doc(id);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            let d = doc.data();
            docRef.update({
              dibeli: d.dibeli + parseInt(data.produk[i].jumlah, 10),
            });
          } else {
            console.log('No such document!');
          }
        })
        .catch(function(error) {
          console.log(`Error updating product with id : ${id} \n`, error);
        });
    }
  };

  rejectOrder = (data, index) => {
    Alert.alert(
      'Peringatan',
      'Aksi ini tidak bisa dibatalkan. Ingin menolak pesanan ?',
      [{ text: 'OK', onPress: () => this.rejectOrderExecute(data, index) }],
      { cancelable: true }
    );
  };

  rejectOrderExecute = (data, index) => {
    let docRef = db.collection('pemesanan').doc(data.id_pemesanan);
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
          this.sendNotification(data, 'menolak');
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error searching pemesanan with id ${data.id_pemesanan} \n`, error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Riwayat Pemesanan Toko" />
        <Content padder>
          {!this.state.isDataFetched && <Loading />}
          {this.state.isDataFetched && this.state.dataOrders.length > 0 && (
            <View>
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
                      <Text>({data.pembeli})</Text>
                      <Text style={{ fontSize: 12 }}>
                        {dayjs(data.waktu_pemesanan).format('dddd, D MMMM YYYY HH:m:s')}
                      </Text>
                      <Text style={{ marginTop: 25 }}>
                        Rp {convertToCurrency(data.produk[0].harga)} (
                        {data.produk[0].jumlah + ' ' + data.produk[0].satuan})
                      </Text>
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
                        <Text style={{ marginTop: 25 }}>
                          Rp {convertToCurrency(data.produk[1].harga)} (
                          {data.produk[1].jumlah + ' ' + data.produk[1].satuan})
                        </Text>
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
                        <Text style={{ marginTop: 25 }}>
                          Rp {convertToCurrency(data.produk[2].harga)} (
                          {data.produk[2].jumlah + ' ' + data.produk[2].satuan})
                        </Text>
                      </Col>
                    </Row>
                  )}
                  {data.status === 'Menunggu Konfirmasi' ? (
                    <Row style={{ marginTop: 5 }}>
                      <Col>
                        <Button
                          small
                          success
                          style={{ width: 0.5 * width - 30, justifyContent: 'center' }}
                          onPress={() => this.acceptOrder(data, i)}>
                          {this.state['isAcceptedLoading' + i] ? (
                            <Spinner color="green" />
                          ) : (
                            <Text>Terima</Text>
                          )}
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          small
                          danger
                          style={{ width: 0.5 * width - 30, justifyContent: 'center' }}
                          onPress={() => this.rejectOrder(data, i)}>
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
                        <View style={styles.acceptOrderMessage}>
                          <Text style={{ textAlign: 'center', color: 'white' }}>
                            Pemesanan telah diterima
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.rejectOrderMessage}>
                          <Text style={{ textAlign: 'center', color: 'white' }}>
                            Pemesanan telah ditolak
                          </Text>
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
  acceptOrderMessage: {
    backgroundColor: '#1FCBE3',
    padding: 5,
    width: width - 30,
    marginTop: 5,
  },
  rejectOrderMessage: {
    backgroundColor: '#F13053',
    padding: 5,
    width: width - 30,
    marginTop: 5,
  },
});

export default Authentication(ShopOrderScreen);
