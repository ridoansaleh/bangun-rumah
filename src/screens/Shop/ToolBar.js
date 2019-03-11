import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
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
  List,
  ListItem,
  Text,
} from 'native-base';
// import { db } from '../../../firebase.config';
import { urls } from '../../constant';

// const { width, height } = Dimensions.get('window');

class ToolBar extends Component {
  static propTypes = {
    nav: PropTypes.object,
    shopId: PropTypes.string,
  };

  handleTouchItem = (url, param) => {
    this.props.nav.navigation.navigate(url, param);
  };

  render() {
    return (
      <View>
        <List>
          <ListItem>
            <TouchableHighlight
              onPress={() => this.handleTouchItem(urls.shop_order, { id: this.props.shopId })}>
              <Text>Daftar Pemesanan</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight
              onPress={() => this.handleTouchItem(urls.shop_analyzes, { id: this.props.shopId })}>
              <Text>Analisa Toko</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight
              onPress={() => this.handleTouchItem(urls.shop_edit, { id: this.props.shopId })}>
              <Text>Edit Toko</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight>
              <Text>Non-aktifkan Toko</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight>
              <Text>Hapus Toko</Text>
            </TouchableHighlight>
          </ListItem>
        </List>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   header: {
//     marginTop: 25,
//   },
// });

export default ToolBar;
