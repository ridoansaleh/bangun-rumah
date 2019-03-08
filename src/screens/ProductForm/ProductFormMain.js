import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Left, Body, Right, Title } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../components/Authentication';
import NewForm from './NewForm';
import EditForm from './EditForm';
import styles from './Styles';

class ProductFormScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    let product_id = this.props.nav.navigation.getParam('product_id', false);
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{product_id ? 'Edit Produk' : 'Produk Baru'}</Title>
          </Body>
          <Right />
        </Header>
        {product_id ? (
          <EditForm {...this.props.nav} productId={product_id} />
        ) : (
          <NewForm {...this.props.nav} />
        )}
      </KeyboardAwareScrollView>
    );
  }
}

export default Authentication(ProductFormScreen);
