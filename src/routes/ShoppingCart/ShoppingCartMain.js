import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Dimensions, ScrollView } from 'react-native';
import { Container, Content, Text, CheckBox, Button } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import defaultImage from '../../../assets/default-product.jpg';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class ShoppingCartScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header
          openDrawer={() => this.props.nav.navigation.openDrawer()}
          title
          titleText="Keranjang"
          search={false}
        />
        <Content>
          <Grid style={{ backgroundColor: 'white', height: height * 0.8 }}>
            <Row size={90} style={{ marginTop: 15 }}>
              <ScrollView>
                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col size={1}>
                    <CheckBox checked={false} style={{ marginTop: width * 0.2 * 0.25 }} />
                  </Col>
                  <Col size={3}>
                    <Image
                      source={defaultImage}
                      style={{ width: width * 0.2, height: height * 0.1 }}
                    />
                  </Col>
                  <Col size={4} style={{ paddingTop: width * 0.2 * 0.1 }}>
                    <Text>Nama Produk</Text>
                    <Text>Rp 12.000</Text>
                  </Col>
                  <Col
                    size={2}
                    style={{
                      marginTop: width * 0.2 * 0.2,
                      textAlign: 'right',
                    }}>
                    <Text>Satuan</Text>
                  </Col>
                </Row>
              </ScrollView>
            </Row>
            <Row
              size={10}
              style={{
                backgroundColor: 'white',
                borderColor: 'black',
                borderTopWidth: 1,
              }}>
              <Col size={1}>
                <CheckBox checked={false} style={{ marginTop: 15 }} />
              </Col>
              <Col size={6}>
                <Text style={{ marginTop: 15 }}>Semua</Text>
              </Col>
              <Col size={3}>
                <Button small bordered dark style={{ marginTop: 10 }}>
                  <Text>Pesan</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Content>
        <Footer {...this.props.nav} pageActive={urls.cart} />
      </Container>
    );
  }
}

export default Authentication(ShoppingCartScreen);
