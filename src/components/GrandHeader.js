import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import { Header, Button, Body, Title, Icon, Left, Right, Input, Item, Text } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { urls } from '../constant';

const { width } = Dimensions.get('window');

class GrandHeader extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
    nav: PropTypes.object,
    title: PropTypes.bool,
    titleText: PropTypes.string,
    displaySearchIcon: PropTypes.bool,
    isSearching: PropTypes.bool,
    setSearchingValue: PropTypes.func,
  };

  state = {
    searchText: '',
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
          <Body>
            <Grid>
              <Row>
                <Col style={{ width: 0.7 * width }}>
                  <Item regular>
                    <Input
                      placeholder="Tulis Produk"
                      value={this.state.searchText}
                      onChangeText={val => {
                        this.setState({
                          searchText: val,
                        });
                      }}
                    />
                  </Item>
                </Col>
                <Col>
                  <Button transparent onPress={() => this.findProduct()}>
                    <Text>Cari</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.setSearchingValue(false)}>
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
            <Button transparent onPress={() => this.props.setSearchingValue(true)}>
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
