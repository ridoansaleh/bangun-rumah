import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, FlatList, Dimensions } from 'react-native';
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
import StarRating from 'react-native-star-rating';
import Authentication from '../../components/Authentication';
import { db } from '../../../firebase.config';
import { convertToCurrency } from '../../utils';

const numColumns = 2;
const { width, height } = Dimensions.get('window');
const halfWidth = width / numColumns;

const dataSpecs = [
  { id: 1, text: 'In order to constrain memory' },
  { id: 2, text: 'In order to constrain memory' },
  { id: 3, text: 'In order to constrain memory' },
  { id: 4, text: 'In order to constrain memory' },
];

class ProductDescription extends Component {
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
        <Text style={{ marginBottom: 20, fontWeight: 'bold' }}>Nama Barang</Text>
        <Grid>
          <Row style={{ marginBottom: 30 }}>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book.
            </Text>
          </Row>
          <Row style={{ marginBottom: 30 }}>
            <Col size={2}>
              <StarRating disabled maxStars={5} rating={4} starSize={20} fullStarColor={'gold'} />
            </Col>
            <Col size={2} />
            <Col size={2}>
              <Text style={{ fontWeight: 'bold' }}>Nama Toko</Text>
            </Col>
          </Row>
          <Row>
            <Text style={{ fontWeight: 'bold' }}>Spesifikasi:</Text>
          </Row>
          <Row>
            <FlatList
              data={dataSpecs}
              renderItem={({ item, index }) => {
                return (
                  <Text>
                    {index + 1}. {item.text}
                  </Text>
                );
              }}
              keyExtractor={item => item.id.toString()}
            />
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default ProductDescription;
