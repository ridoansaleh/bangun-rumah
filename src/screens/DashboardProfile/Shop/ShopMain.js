import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Button, Content, Header, Icon, Left, Body, Right, Title } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../../components/Authentication';
import Shop from './Shop';
import ShopForm from './ShopForm';
import ToolBar from './ToolBar';
import Loading from '../../../components/Loading';
import { db } from '../../../../firebase.config';
import { urls } from '../../../constant';

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
            this.getShopProducts(data, hasThisShop);
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

  shouldComponentUpdate(nextProps) {
    if (nextProps.nav.navigation.getParam('add_product_succeed', false)) {
      this.checkUserHaveShop();
    }
    return true;
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
          this.getShopProducts(data, true);
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

  getShopProducts = (toko, ownership) => {
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
            isUserOwnedThisShop: ownership,
            dataShop: toko[0],
            dataProducts: data,
          });
        } else {
          this.setUserVisitShop(ownership, toko[0], data);
        }
      })
      .catch(error => {
        console.error('Error getting shop products data \n', error);
      });
  };

  setUserVisitShop = (ownership, shop, products) => {
    db.collection('kunjungan')
      .add({
        id_toko: shop.id_toko,
        id_user: this.props.user.id || 0,
        tanggal: new Date(),
      })
      .then(docRef => {
        console.log('Successfully added visiting data with id : ', docRef.id);
        this.setState({
          isDataFetched: true,
          isUserHaveShop: true,
          isUserOwnedThisShop: ownership,
          dataShop: shop,
          dataProducts: products,
        });
      })
      .catch(error => {
        console.error('Error adding visiting data \n', error);
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
          {this.state.isUserOwnedThisShop && (
            <Right>
              <Button
                transparent
                onPress={() =>
                  this.props.nav.navigation.navigate(urls.messages, {
                    shopId: this.state.dataShop.id_toko,
                    shop: {
                      photo: this.state.dataShop.photo,
                      nama_toko: this.state.dataShop.nama,
                    },
                    chatType: 'shopChatting',
                  })
                }>
                <Icon name="chatbubbles" style={{ color: 'white' }} />
              </Button>
              <Button transparent onPress={() => this.setState({ isToolbarShow: true })}>
                <Icon name="more" style={{ color: 'white' }} />
              </Button>
            </Right>
          )}
        </Header>
        <Content>
          {!this.state.isDataFetched && <Loading />}
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
              getShopProducts={this.getShopProducts}
            />
          )}
          {this.state.isDataFetched && this.state.isToolbarShow && (
            <ToolBar
              {...this.props}
              shopId={this.state.dataShop.id_toko}
              shop={this.state.dataShop}
            />
          )}
        </Content>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default Authentication(ShopScreen);
