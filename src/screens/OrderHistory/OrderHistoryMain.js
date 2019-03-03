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
import { urls } from '../../constant';
import { convertToCurrency } from '../../utils';

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
          orders.push(doc.data());
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

  printOrderNote = () => {
    // print order note
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
            <View style={{ borderColor: 'black', borderWidth: 1, padding: 10 }}>
              {this.state.dataOrders.map((data, i) => (
                <Grid key={i}>
                  <Row>
                    <Col>
                      <Image
                        source={{ uri: data.photo_produk }}
                        style={{ width: 0.4 * width, height: 0.25 * height }}
                      />
                    </Col>
                    <Col>
                      <Text style={{ fontWeight: 'bold' }}>{data.nama_produk}</Text>
                      <Text>({data.nama_toko})</Text>
                      <Text style={{ fontSize: 12 }}>{data.waktu_pemesanan}</Text>
                      <Text style={{ marginTop: 25 }}>
                        Rp {convertToCurrency(data.harga)} / {data.jumlah_produk} {data.satuan}
                      </Text>
                      <Text>{data.status}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col size={4} />
                    <Col size={6}>
                      <Button
                        small
                        bordered
                        style={{ marginTop: 15 }}
                        onClick={() => this.printOrderNote()}>
                        <Text>Cetak Bukti Pemesanan</Text>
                      </Button>
                    </Col>
                  </Row>
                </Grid>
              ))}
            </View>
          )}
          {this.state.isDataFetched && this.state.dataOrders.length === 0 && (
            <View
              style={{
                flex: 1,
                height: 0.4 * height,
                marginTop: 0.2 * height,
                marginBottom: 0.2 * height,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={sadImage}
                style={{
                  width: 0.4 * width,
                  height: 0.2 * height,
                }}
              />
              <Text style={{ marginTop: 15 }}>Anda belum memiliki riwayat pemesanan</Text>
              <Button
                small
                bordered
                style={{
                  width: 0.3 * width,
                  marginLeft: 0.35 * width,
                  marginRight: 0.35 * width,
                  marginTop: 20,
                }}
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
});

export default Authentication(OrderHistoryScreen);
