import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';
import { Print, Constants } from 'expo';
import { Button, Container, Content, Text, View } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import PDFReader from 'rn-pdf-reader-js';
import dayjs from 'dayjs';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import sadImage from '../../../../assets/sad_face.png';
import { db } from '../../../../firebase.config';
import { urls } from '../../../constant';
import { convertToCurrency, convertToDate, width, height } from '../../../utils';

const urlLogo =
  'https://firebasestorage.googleapis.com/v0/b/golek-6378b.appspot.com/o/Screenshot%20from%202019-05-27%2022-54-41.png?alt=media&token=b98776e1-f281-46f8-9e18-b8759a2be520';

class OrderHistoryScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataOrders: [],
    isPdfExist: false,
    pdfFile: '',
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
        console.warn("Error getting order history's data \n", error);
      });
  };

  generateTableRow = (index, total, data) => {
    let result = '';
    for (let i = 0; i < total; i++) {
      const row = `
        <tr>
          <td width="50">1</td>
          <td>${data.produk[index].nama}</td>
          <td>${data.produk[index].jumlah} ${data.produk[index].satuan}</td>
          <td>Rp ${convertToCurrency(data.produk[index].harga / data.produk[index].jumlah)}</td>
          <td>Rp ${convertToCurrency(data.produk[index].harga)}</td>
        </tr>
      `;
      result = result.concat(row);
    }
    return result;
  };

  printOrderNote = async data => {
    let tableContent = '';
    if (data.produk.length === 1) {
      tableContent = this.generateTableRow(0, 1, data);
    } else if (data.produk.length === 2) {
      tableContent = this.generateTableRow(1, 2, data);
    } else if (data.produk.length === 3) {
      tableContent = this.generateTableRow(2, 3, data);
    }

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
              <img id="my-icon" src=${urlLogo} height="42" width="42" />
            </div>
            <div class="top-title-left">
              <b>Bukti Pemesanan Barang - ${data.toko}</b>
            </div>
          </div>
          <table class="table-1" style="width:100%">
            <tr>
              <th colspan="2">Data Pemesan</th>
            </tr>
            <tr>
              <td width="150">Nama</td>
              <td>:  ${data.pembeli}</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>:  ${data.alamat_pengiriman}</td>
            </tr>
            <tr>
              <td>Kontak</td>
              <td>:  ${this.props.user.email}</td>
            </tr>
            <tr>
              <td>Tanggal Pemesanan</td>
              <td>:  ${convertToDate(data.waktu_pemesanan)}</td>
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
            ${tableContent}
            <tr>
              <td colspan="5">Total harga pemesanan : Rp ${convertToCurrency(data.total_harga)}</td>
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
    };

    let res = await Print.printToFileAsync(options);

    if (res.uri) {
      this.setState({
        isPdfExist: true,
        pdfFile: res.uri,
      });
    }
  };

  showAllProducts = index => {
    this.setState({
      ['showMore' + index]: !this.state['showMore' + index],
    });
  };

  render() {
    if (this.state.isPdfExist) {
      return (
        <View style={styles.container}>
          <PDFReader source={{ uri: this.state.pdfFile }} />
        </View>
      );
    }
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
                  {data.status === 'Diterima' && (
                    <Button
                      small
                      bordered
                      style={{
                        marginTop: 15,
                        width: 0.6 * width - 17,
                        marginLeft: 0.4 * width - 17,
                        marginRight: 5,
                      }}
                      onPress={() => this.printOrderNote(data)}>
                      <Text>Cetak Bukti Pemesanan</Text>
                    </Button>
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
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
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
