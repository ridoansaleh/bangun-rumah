import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import NewForm from './NewForm';
import EditForm from './EditForm';

class ProductFormScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    let product_id = this.props.nav.navigation.getParam('product_id', false);
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header {...this.props} title={product_id ? 'Edit Produk' : 'Produk Baru'} />
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
