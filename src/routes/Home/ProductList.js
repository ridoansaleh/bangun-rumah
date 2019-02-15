import React, { Component } from 'react';
import { Dimensions, StyleSheet, FlatList, Image } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import StarRating from 'react-native-star-rating';
import { db } from '../../../firebase.config';
import { convertToCurrency } from '../../utils';
const emptyResult = require('../../../assets/empty_search_result.png');

const numColumns = 2;
const { width } = Dimensions.get('window');
const halfWidth = width / numColumns;

class ProductList extends Component {
  state = {
    isDataFetched: false,
    dataProducts: [],
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = () => {
    const that = this;
    const productsRef = db.collection('produk');
    let products = [];
    productsRef
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          products.push(doc.data());
        });
        that.setState({
          isDataFetched: true,
          dataProducts: products,
        });
      })
      .catch(function(error) {
        console.error('Error getting document:', error);
      });
  };

  render() {
    const { isDataFetched, dataProducts } = this.state;
    if (!isDataFetched) {
      return (
        <View style={styles.spin}>
          <Spinner color="green" size="large" />
        </View>
      );
    } else {
      if (dataProducts.length > 0) {
        return (
          <FlatList
            data={dataProducts}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.photo_produk[0] }} style={styles.productImage} />
                <Text>{item.nama}</Text>
                <StarRating
                  disabled
                  maxStars={5}
                  rating={parseInt(item.bintang)}
                  starSize={20}
                  fullStarColor={'gold'}
                />
                <Text>Rp {convertToCurrency(parseInt(item.harga))}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            numColumns={numColumns}
          />
        );
      } else {
        return (
          <View style={styles.emptyContainer}>
            <Image source={emptyResult} style={styles.emptyLogo} />
            <Text style={styles.emptyText}>Belum Ada Produk</Text>
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: halfWidth,
    height: halfWidth,
    flex: 1,
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
    height: width * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  emptyText: {
    fontSize: 20,
    // fontWeight: 'bold',
  },
});

export default ProductList;
