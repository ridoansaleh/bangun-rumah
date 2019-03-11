import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Header, Button, Body, Title, Icon, Left, Right } from 'native-base';

class GrandHeader extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
    title: PropTypes.bool,
    titleText: PropTypes.string,
    search: PropTypes.bool,
  };

  render() {
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
          {this.props.search && (
            <Button transparent>
              <Icon name="search" />
            </Button>
          )}
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

export default GrandHeader;
