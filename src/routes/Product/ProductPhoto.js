import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Dimensions, ScrollView } from 'react-native';
// import { Constants } from 'expo';
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
// import { Grid, Row, Col } from 'react-native-easy-grid';
// import emptyResult from '../../../assets/empty_search_result.png';
// import { db } from '../../../firebase.config';

const numColumns = 2;
const { width, height } = Dimensions.get('window');
const halfWidth = width / numColumns;

const images = [
  {
    source: {
      uri: 'https://cdn.pixabay.com/photo/2017/05/19/07/34/teacup-2325722__340.jpg',
    },
  },
  {
    source: {
      uri: 'https://cdn.pixabay.com/photo/2017/05/02/22/43/mushroom-2279558__340.jpg',
    },
  },
  {
    source: {
      uri: 'https://cdn.pixabay.com/photo/2017/05/18/21/54/tower-bridge-2324875__340.jpg',
    },
  },
  {
    source: {
      uri: 'https://cdn.pixabay.com/photo/2017/05/16/21/24/gorilla-2318998__340.jpg',
    },
  },
];

class ProductPhoto extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    category: '',
    isDataFetched: false,
    dataProducts: [],
    clicked: 0,
  };

  componentDidMount() {
    // console.log('product photo');
  }

  render() {
    let { isDataFetched, dataProducts, category } = this.state;
    return (
      <View style={styles.scrollContainer}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {images.map((image, i) => (
            <Image style={styles.image} source={image.source} key={i} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: height * 0.3,
  },
  image: {
    width,
    height: height * 0.3,
  },
});

export default ProductPhoto;
