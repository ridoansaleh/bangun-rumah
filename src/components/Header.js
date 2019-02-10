import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Header, Button, Icon, Left, Right } from 'native-base';

class Navbar extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
  };

  render() {
    return (
      <Header noShadow style={styles.header}>
        <Left>
          <Button transparent onPress={() => this.props.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Right>
          <Button transparent>
            <Icon name="search" />
          </Button>
          <Button transparent>
            <Icon name="notifications-outline" />
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

export default Navbar;
