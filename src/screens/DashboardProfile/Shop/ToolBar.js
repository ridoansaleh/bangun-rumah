import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, TouchableHighlight, Switch } from 'react-native';
import { View, List, ListItem, Text } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import { db } from '../../../../firebase.config';
import { urls } from '../../../constant';

class ToolBar extends Component {
  static propTypes = {
    nav: PropTypes.object,
    shop: PropTypes.object,
    shopId: PropTypes.string,
  };

  state = {
    shopStatus: this.props.shop.status,
    isShopActive: true,
    shopLabel: 'Non-aktifkan Toko',
  };

  handleTouchItem = (url, param) => {
    this.props.nav.navigation.navigate(url, param);
  };

  toggleShopStatus = (id, status) => {
    let docRef = db.collection('toko').doc(id);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            status: status === 'Aktif' ? 'Tidak Aktif' : 'Aktif',
          });
          this.setState(prevState => ({
            isShopActive: !prevState.isShopActive,
            shopLabel: prevState.isShopActive ? 'Aktifkan Toko' : 'Non-aktifkan Toko',
          }));
        } else {
          console.warn('No such document!');
        }
      })
      .catch(error => {
        console.warn(`Error updating toko's status with id ${id} \n`, error);
      });
  };

  deleteShop = id => {
    let data = [];
    db.collection('pemesanan')
      .where('id_toko', '==', id)
      .where('status', '==', 'Menunggu Konfirmasi')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_pemesanan: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 1) {
          Alert.alert(
            'Peringatan',
            'Masih ada pemesanan ke Toko Anda yang belum dikonfirmasi. Segera terima atau tolak!',
            [{ text: 'OK', onPress: () => console.log('Close alert dialog') }],
            { cancelable: true }
          );
        } else {
          Alert.alert(
            'Peringatan',
            'Apakah Anda yakin ingin menghapus Toko ini secara permanen ?',
            [{ text: 'OK', onPress: () => this.executeDeleteShop(id) }],
            { cancelable: true }
          );
        }
      })
      .catch(error => {
        console.warn('Error searching orders data based on this shop_id \n', error);
      });
  };

  executeDeleteShop = id => {
    db.collection('toko')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Shop successfully deleted!');
        this.deleteVisitStats(id);
      })
      .catch(function(error) {
        console.warn('Error deleting shop \n', error);
      });
  };

  deleteVisitStats = id => {
    let data = [];
    db.collection('kunjungan')
      .where('id_toko', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_kunjungan: doc.id,
            ...doc.data(),
          });
        });
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            db.collection('kunjungan')
              .doc(data[i].id_kunjungan)
              .delete()
              .then(() => {
                console.log('Visiting data successfully deleted!');
                this.props.nav.navigation.navigate(urls.profile);
              })
              .catch(function(error) {
                console.warn('Error deleting visiting data stats \n', error);
              });
          }
        } else {
          this.props.nav.navigation.navigate(urls.profile);
        }
      })
      .catch(error => {
        console.warn('Error searching visiting data stats \n', error);
      });
  };

  render() {
    const { shopStatus, isShopActive, shopLabel } = this.state;
    const { shopId } = this.props;
    return (
      <View>
        <List>
          <ListItem>
            <TouchableHighlight
              onPress={() => this.handleTouchItem(urls.shop_order, { id: shopId })}>
              <Text>Daftar Pemesanan</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight
              onPress={() => this.handleTouchItem(urls.shop_analyzes, { id: shopId })}>
              <Text>Analisa Toko</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight
              onPress={() => this.handleTouchItem(urls.shop_edit, { id: shopId })}>
              <Text>Edit Toko</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <Grid>
              <Row>
                <Col
                  size={4}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <Text style={{ textAlign: 'left' }}>{shopLabel}</Text>
                </Col>
                <Col size={1}>
                  <Switch
                    value={isShopActive}
                    onValueChange={() => this.toggleShopStatus(shopId, shopStatus)}
                  />
                </Col>
              </Row>
            </Grid>
          </ListItem>
          <ListItem>
            <TouchableHighlight onPress={() => this.deleteShop(shopId)}>
              <Text>Hapus Toko</Text>
            </TouchableHighlight>
          </ListItem>
        </List>
      </View>
    );
  }
}

export default ToolBar;
