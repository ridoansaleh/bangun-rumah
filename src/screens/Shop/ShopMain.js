import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import {
  Button,
  Content,
  Header,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  View,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../components/Authentication';
import Shop from './Shop';
import ShopForm from './ShopForm';
import ToolBar from './ToolBar';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ShopScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    isUserHaveShop: false,
    isUserOwnedThisShop: false,
    dataShop: {},
    dataProducts: [],
    isToolbarShow: false,
  };

  componentDidMount() {
    const shopId = this.props.nav.navigation.getParam('id_toko', 0);
    if (shopId) {
      const docRef = db.collection('toko').doc(shopId);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            let data = [doc.data()];
            data[0].id_toko = shopId;
            const hasThisShop = data[0].id_user === this.props.user.id;
            this.getShopProducts(data, true, hasThisShop);
          } else {
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.error('Error getting shop document \n', error);
        });
    } else {
      this.checkUserHaveShop();
    }
  }

  checkUserHaveShop = () => {
    let data = [];
    db.collection('toko')
      .where('id_user', '==', this.props.user.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_toko: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 1) {
          this.getShopProducts(data);
        } else {
          this.setState({
            isDataFetched: true,
          });
        }
      })
      .catch(error => {
        console.error("Error getting shop's data \n", error);
      });
  };

  getShopProducts = (toko, ownership, status) => {
    let data = [];
    db.collection('produk')
      .where('id_toko', '==', toko[0].id_toko)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_produk: doc.id,
            ...doc.data(),
          });
        });
        if (ownership) {
          this.setState({
            isDataFetched: true,
            isUserHaveShop: true,
            isUserOwnedThisShop: status,
            dataShop: toko[0],
            dataProducts: data,
          });
        } else {
          this.setState({
            isDataFetched: true,
            isUserHaveShop: true,
            isUserOwnedThisShop: true,
            dataShop: toko[0],
            dataProducts: data,
          });
        }
      })
      .catch(error => {
        console.error('Error getting shop products data \n', error);
      });
  };

  setLoading = val => {
    this.setState({
      isDataFetched: val,
    });
  };

  handleBackBtn = () => {
    if (this.state.isToolbarShow) {
      this.setState({
        isToolbarShow: false,
      });
    } else {
      this.props.nav.navigation.goBack();
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.handleBackBtn()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{!this.state.isToolbarShow ? 'Toko' : 'Toolbar'}</Title>
          </Body>
          <Right>
            <Icon
              name="more"
              style={{ color: 'white' }}
              onPress={() => this.setState({ isToolbarShow: true })}
            />
          </Right>
        </Header>
        <Content>
          {!this.state.isDataFetched && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
          {this.state.isDataFetched && !this.state.isToolbarShow && !this.state.isUserHaveShop && (
            <ShopForm
              {...this.props}
              checkUserHaveShop={this.checkUserHaveShop}
              setLoading={this.setLoading}
            />
          )}
          {this.state.isDataFetched && !this.state.isToolbarShow && this.state.isUserHaveShop && (
            <Shop
              {...this.props}
              shop={this.state.dataShop}
              products={this.state.dataProducts}
              isUserOwnedThisShop={this.state.isUserOwnedThisShop}
            />
          )}
          {this.state.isDataFetched && this.state.isToolbarShow && <ToolBar />}
        </Content>
      </KeyboardAwareScrollView>
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

export default Authentication(ShopScreen);
