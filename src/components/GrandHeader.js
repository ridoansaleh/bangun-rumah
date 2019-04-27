import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Header,
  Button,
  Body,
  Title,
  Icon,
  Left,
  Right,
  Input,
  Item,
  Text,
  Badge,
} from 'native-base';
import { urls } from '../constant';
import { db } from '../../firebase.config';
import { width } from '../utils';

class GrandHeader extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
    nav: PropTypes.object,
    user: PropTypes.object,
    title: PropTypes.bool,
    titleText: PropTypes.string,
    displaySearchIcon: PropTypes.bool,
    isSearching: PropTypes.bool,
    setSearchValue: PropTypes.func,
  };

  state = {
    searchText: '',
    totalNotification: 0,
  };

  componentDidMount() {
    if (this.props.isLogin) {
      this.countTotalNotification(this.props.user.id);
    }
  }

  countTotalNotification = id => {
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
          totalNotification: data.length,
        });
      })
      .catch(error => {
        console.error("Error searching notification's data \n", error);
      });
  };

  findProduct = () => {
    if (this.state.searchText) {
      this.props.nav.navigation.navigate(urls.search, {
        cat: 'all',
        productName: this.state.searchText,
      });
    }
  };

  render() {
    if (this.props.isSearching) {
      return (
        <Header noShadow style={styles.header}>
          <Body style={{ marginRight: 5 }}>
            <Item regular style={{ width: 0.67 * width }}>
              <Input
                placeholder="Tulis Produk"
                value={this.state.searchText}
                style={{ backgroundColor: 'white', height: '100%' }}
                onChangeText={val => {
                  this.setState({
                    searchText: val,
                  });
                }}
              />
            </Item>
          </Body>
          <Right>
            <Button transparent onPress={() => this.findProduct()}>
              <Text>Cari</Text>
            </Button>
            <Button transparent onPress={() => this.props.setSearchValue(false)}>
              <Icon name="close-circle-outline" />
            </Button>
          </Right>
        </Header>
      );
    }
    return (
      <Header noShadow style={styles.header}>
        <Left>
          <Button transparent onPress={() => this.props.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        {this.props.title && (
          <Body>
            <Title>{this.props.titleText}</Title>
          </Body>
        )}
        <Right>
          {this.props.displaySearchIcon && (
            <Button transparent onPress={() => this.props.setSearchValue(true)}>
              <Icon name="search" />
            </Button>
          )}
          <Button transparent onPress={() => this.props.nav.navigation.navigate(urls.notification)}>
            <Icon name="notifications-outline" />
            {this.state.totalNotification > 0 && (
              <Badge style={{ width: 20, height: 20 }}>
                <Text style={{ fontSize: 8 }}>{this.state.totalNotification}</Text>
              </Badge>
            )}
          </Button>
        </Right>
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default GrandHeader;
