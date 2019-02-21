import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import {
  Container,
  Content,
  Text,
  Header,
  Left,
  Button,
  Icon,
  Title,
  Body,
  Spinner,
  ActionSheet,
  Tabs,
  Tab,
  Accordion,
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
// import StarRating from 'react-native-star-rating';
// import Authentication from '../../components/Authentication';
// import emptyResult from '../../../assets/empty_search_result.png';
// import { db } from '../../../firebase.config';
// import { convertToCurrency } from '../../utils';

const numColumns = 2;
const { width, height } = Dimensions.get('window');

const Tab1 = () => (
  <View>
    <Text>
      Tabs are a horizontal region of buttons or links that allow for a consistent navigation
      experience between screens.
    </Text>
  </View>
);

const Tab2 = () => (
  <View>
    <Text>
      It can contain any combination of text and icons, and is a popular method for enabling mobile
      navigation.
    </Text>
  </View>
);

class Interactions extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    category: '', //this.props.nav.navigation.getParam('cat', 'Kategori Produk'),
    isDataFetched: false,
    dataProducts: [],
    clicked: 0,
  };

  componentDidMount() {
    console.log('product photo');
  }

  render() {
    let { isDataFetched, dataProducts, category } = this.state;
    return (
      <View style={{ padding: 20 }}>
        <Tabs initialPage={0}>
          <Tab heading="Review">
            <Tab1 />
          </Tab>
          <Tab heading="Diskusi">
            <Tab2 />
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default Interactions;
