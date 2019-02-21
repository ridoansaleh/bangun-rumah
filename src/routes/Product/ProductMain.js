import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Dimensions, ScrollView, Alert, Platform } from 'react-native';
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
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating';
import Authentication from '../../components/Authentication';
import ProductPhoto from './ProductPhoto';
import ProductDescription from './ProductDescription';
import Interactions from './Interactions';
import emptyResult from '../../../assets/empty_search_result.png';
import { db } from '../../../firebase.config';
import { convertToCurrency } from '../../utils';

const numColumns = 2;
const { width, height } = Dimensions.get('window');
const halfWidth = width / numColumns;

const fontAwesome = {
  iconFamily: 'FontAwesome',
  iconFontSize: Platform.OS === 'ios' ? 30 : 28,
  iconMargin: 7,
  iconLineHeight: Platform.OS === 'ios' ? 37 : 30,
};

class ProductMainScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    productID: this.props.nav.navigation.getParam('productID', 0),
    isDataFetched: true,
    dataProducts: [],
    clicked: 0,
  };

  componentDidMount() {
    // let products = [];
    // db.collection('produk')
    //   .where('kategori', '==', this.state.category)
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.forEach(function(doc) {
    //       products.push(doc.data());
    //     });
    //     this.setState({
    //       isDataFetched: true,
    //       dataProducts: products,
    //     });
    //   })
    //   .catch(error => {
    //     console.log(`Error getting products with category ${this.state.category} \n`, error);
    //   });
  }

  render() {
    let { isDataFetched, dataProducts, category } = this.state;
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Detil Produk</Title>
          </Body>
        </Header>
        <Content>
          <Grid style={{ height: height * 0.88 }}>
            <Row size={93}>
              <ScrollView>
                {!isDataFetched && (
                  <View style={styles.spin}>
                    <Spinner color="green" size="large" />
                  </View>
                )}
                {/* {isDataFetched && dataProducts.length > 0 && ( */}
                {isDataFetched && (
                  <View>
                    <ProductPhoto />
                    <ProductDescription />
                    <Interactions />
                  </View>
                )}
              </ScrollView>
            </Row>
            <Row size={7} style={{ borderTopColor: 'black', borderTopWidth: 1 }}>
              <Col size={0.5} style={{ marginTop: 8 }}>
                <Icon name="chatboxes" style={{ paddingLeft: width * 0.05 }} />
              </Col>
              <Col size={2.5} style={{ marginTop: 8 }}>
                <Icon name="cart" style={{ paddingLeft: width * 0.05 }} />
              </Col>
              <Col size={2}>
                <Button full style={{ height: '100%' }}>
                  <Text>Pesan Sekarang</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  itemContainer: {
    width: halfWidth,
    height: halfWidth,
    margin: 3,
    alignItems: 'center',
  },
  productImage: {
    width: halfWidth * 0.7,
    height: halfWidth * 0.6,
    marginTop: 15,
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    marginTop: (height * 0.75) / 2,
    marginBottom: (height * 0.75) / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.5,
    marginTop: height * 0.15,
    marginBottom: height * 0.25,
  },
  emptyLogo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  emptyText: {
    fontSize: 13,
  },
});

export default Authentication(ProductMainScreen);
