import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import EmptyNotification from '../../../assets/no_message.png';
import { db } from '../../../firebase.config';
import { urls } from '../../constant';
import { convertToDate } from '../../utils';

const { width, height } = Dimensions.get('window');

class NotificationScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataNotification: [],
  };

  componentDidMount() {
    this.getNotifications(this.props.user.id);
  }

  getNotifications = id => {
    let data = [];
    db.collection('notifikasi')
      .where('penerima', '==', id)
      .where('status', '==', 'Belum dibaca')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_notifikasi: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          isDataFetched: true,
          dataNotification: data,
        });
      })
      .catch(error => {
        console.error("Error searching notification's data \n", error);
      });
  };

  notificationClick = data => {
    let docRef = db.collection('notifikasi').doc(data.id_notifikasi);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            status: 'Telah dibaca',
          });
          console.log('Notification successfully read!');
          this.checkUserHaveShop(data);
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.error(`Error searching notification with product_id ${data.id_produk} \n`, error);
      });
  };

  checkUserHaveShop = param => {
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
          this.checkIsProductYours(data[0].id_toko, param.id_produk);
        } else {
          this.props.nav.navigation.navigate(urls.product, {
            product_id: param.id_produk,
          });
        }
      })
      .catch(error => {
        console.error("Error getting shop's data \n", error);
      });
  };

  checkIsProductYours = (shopId, productId) => {
    const { navigation } = this.props.nav;
    let docRef = db.collection('produk').doc(productId);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          if (data.id_produk === productId) {
            navigation.navigate(urls.shop_order, {
              id: shopId,
            });
          } else {
            navigation.navigate(urls.product, {
              product_id: productId,
            });
          }
        } else {
          navigation.navigate(urls.product, {
            product_id: productId,
          });
        }
      })
      .catch(error => {
        console.error(`Error searching product in a Shop with id ${productId} \n`, error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Notifikasi" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : this.state.dataNotification.length > 0 ? (
            <FlatList
              data={this.state.dataNotification}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => this.notificationClick(item)}>
                  <Grid
                    style={{ width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1 }}>
                    <Row>
                      <Text>{item.jenis}</Text>
                    </Row>
                    <Row>
                      <Text>{item.teks}</Text>
                    </Row>
                    <Text style={{ textAlign: 'right' }}>{convertToDate(item.waktu)}</Text>
                  </Grid>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.id_notifikasi}
              numColumns={1}
            />
          ) : (
            <View style={{ marginTop: 0.25 * height }}>
              <Image source={EmptyNotification} style={styles.noNotification} />
              <Text style={{ textAlign: 'center' }}>Belum ada notifikasi</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  noNotification: {
    height: 0.25 * height,
    width: 0.5 * width,
    marginBottom: 15,
    marginLeft: 0.25 * width,
  },
});

export default Authentication(NotificationScreen);
