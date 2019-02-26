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
  List,
  ListItem,
  Text,
} from 'native-base';
import { db } from '../../../firebase.config';

// const { width, height } = Dimensions.get('window');

class ToolBar extends Component {
  render() {
    return (
      <View>
        <List>
          <ListItem>
            <Text>Daftar Pemesanan</Text>
          </ListItem>
          <ListItem>
            <Text>Analisa Toko</Text>
          </ListItem>
          <ListItem>
            <Text>Edit Toko</Text>
          </ListItem>
          <ListItem>
            <Text>Non-aktifkan Toko</Text>
          </ListItem>
          <ListItem>
            <Text>Hapus Toko</Text>
          </ListItem>
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default ToolBar;
