import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Button, Container, Content, Text, View } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import dayjs from 'dayjs';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import sadImage from '../../../../assets/sad_face.png';
import { db } from '../../../../firebase.config';
import { urls } from '../../../constant';
import { convertToCurrency } from '../../../utils';

const { width, height } = Dimensions.get('window');

class OrderHistoryScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
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
    db.collection('pemesanan')
      .where('id_user', '==', this.props.user.id)
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

  printOrderNote = async () => {
    let htmlTemplate = `
    <!DOCTYPE html>
      <html>
        <head>
          <style>
            .wrapper {
              background-color: 'white';
            }         
            .top-title-left, .top-title-right {
              display: inline-block;
            }
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }            
            table {
              margin-top: 20px;
            }            
            .table-1 td {
              border: 0;
            }            
            th, td {
              padding: 5px;
              text-align: left;
            }
          </style>
        </head>
        <body>
        <div class="wrapper">
          <div class="top-title">
            <div class="top-title-right">
              <img id="my-icon" src="https://images.unsplash.com/photo-1448227922836-6d05b3f8b663?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" height="42" width="42" />
            </div>
            <div class="top-title-left">
              <b>Bukti Pemesanan Barang - Toko Jaya Abadi</b>
            </div>
          </div>
          <table class="table-1" style="width:100%">
            <tr>
              <th colspan="2">Data Pemesan</th>
            </tr>
            <tr>
              <td width="150">Nama</td>
              <td>:  Budiman</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>:  Jalan Bantul No. 14</td>
            </tr>
            <tr>
              <td>Kontak</td>
              <td>:  087821670023</td>
            </tr>
            <tr>
              <td>Tanggal Pemesanan</td>
              <td>:  Senin, 18 Januari 2019</td>
            </tr>
          </table>
          <table style="width:100%">
            <tr>
              <th colspan="5">Detil Barang</th>
            </tr>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
            <tr>
              <td width="150">1</td>
              <td>Pintu Besi</td>
              <td>2 buah</td>
              <td>Rp 120.000</td>
              <td>Rp 240.000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Meja Makan</td>
              <td>1 buah</td>
              <td>Rp 520.000</td>
              <td>Rp 520.000</td>
            </tr>
            <tr>
              <td colspan="5">Total harga pemesanan : Rp 760.000</td>
            </tr>
          </table>
            <p>
              <b>Perhatian</b>
              <br />
              Mohon segera kontak penjual untuk melakukan pembayaran pesanan Anda.
            </p>
          </div>
        </body>
      </html>
    `;

    let options = {
      html: htmlTemplate,
      fileName: 'test',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);
    alert(file.filePath);
  };

  showAllProducts = index => {
    this.setState({
      ['showMore' + index]: !this.state['showMore' + index],
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
                      <Text style={{ fontSize: 12 }}>
                        {dayjs(data.waktu_pemesanan).format('dddd, D MMMM YYYY HH:m:s')}
                      </Text>
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
                        <Text style={{ fontSize: 12 }}>
                          {dayjs(data.waktu_pemesanan).format('dddd, D MMMM YYYY HH:m:s')}
                        </Text>
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
                        <Text style={{ fontSize: 12 }}>
                          {dayjs(data.waktu_pemesanan).format('dddd, D MMMM YYYY HH:m:s')}
                        </Text>
                        <Text style={{ marginTop: 25 }}>
                          Rp {convertToCurrency(data.produk[2].harga)}(
                          {' ' + data.produk[2].jumlah + ' ' + data.produk[2].satuan})
                        </Text>
                        <Text>{data.status}</Text>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col size={3} />
                    <Col size={7}>
                      <Button
                        small
                        bordered
                        style={{ marginTop: 15 }}
                        onClick={() => this.printOrderNote()}>
                        <Text>Cetak Bukti Pemesanan</Text>
                      </Button>
                    </Col>
                  </Row>
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
              <Text style={{ marginTop: 15 }}>Anda belum memiliki riwayat pemesanan</Text>
              <Button
                small
                bordered
                style={styles.shopBtn}
                onPress={() => this.props.nav.navigation.navigate(urls.home)}>
                <Text>Belanja</Text>
              </Button>
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
  shopBtn: {
    width: 0.3 * width,
    marginLeft: 0.35 * width,
    marginRight: 0.35 * width,
    marginTop: 20,
  },
});

export default Authentication(OrderHistoryScreen);
