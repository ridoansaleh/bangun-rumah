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
import { Content, Text, Header, Left, Button, Icon, Title, Body } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../components/Authentication';
import defaultProduct from '../../../assets/default-product.jpg';
// import { urls } from '../../constant';

const { height, width } = Dimensions.get('window');

class OrderMainScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  changeAddress = () => {};

  render() {
    const options = Array.from(Array(100).keys());
    // console.log('Options : ', options);
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
          <Grid
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'black',
              marginBottom: 15,
            }}>
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
              <TouchableHighlight style={{ marginLeft: 10 }} onPress={() => this.changeAddress()}>
                <Text>Ganti Alamat Pengiriman</Text>
              </TouchableHighlight>
            </Row>
          </Grid>
          <Grid style={{ padding: 10 }}>
            <Row>
              <Col>
                <Image
                  source={defaultProduct}
                  style={{ width: 0.4 * width, height: 0.17 * height }}
                />
              </Col>
              <Col>
                <Text>Nama Barang</Text>
                <Text>Rp 10.000</Text>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5, marginTop: 15 }}>
              <Text>Jumlah (Kg)</Text>
            </Row>
            <Row>
              <Picker
                selectedValue={'5'}
                style={{ height: 40, width: width - 20, borderColor: 'black', borderWidth: 1 }}
                onValueChange={(itemValue, itemIndex) => console.log('nothing yet')}>
                {options.map((x, i) => {
                  console.log('i : ', i);
                  return (
                    <Picker.Item key={i} label={(x + 1).toString()} value={(x + 1).toString()} />
                  );
                })}
              </Picker>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <Text>Keterangan</Text>
            </Row>
            <Row>
              <TextInput
                multiline
                numberOfLines={4}
                // onChangeText={val => this.handleChangeField(val, 'description')}
                value={''}
                style={styles.textArea}
              />
            </Row>
            <Row style={{ marginTop: 5 }}>
              <Text>Kode Promo</Text>
            </Row>
            <Row>
              <TextInput
                // onChangeText={val => this.handleChangeField(val, 'description')}
                value={''}
                style={styles.promo}
              />
            </Row>
            <Row style={{ marginBottom: 30 }}>
              <Button
                style={{
                  width: width - 20,
                  justifyContent: 'center',
                }}>
                <Text>Pesan</Text>
              </Button>
            </Row>
          </Grid>
        </Content>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
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
});

export default Authentication(OrderMainScreen);
