import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, Dimensions } from 'react-native';
import {
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  Text,
  View,
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
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

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Pemesanan</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          {!this.state.isDataFetched && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
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
  header: {
    marginTop: 25,
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
