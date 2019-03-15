import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, Text, View } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { db } from '../../../firebase.config';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class ProductsReport extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    return (
      <View>
        <Text>Products Report</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default ProductsReport;
