import React, { Component } from 'react';
import { StyleSheet, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import StarRating from 'react-native-star-rating';
import emptyResult from '../../../assets/empty_search_result.png';
import { db } from '../../../firebase.config';
import { convertToCurrency, width } from '../../utils';
import { urls } from '../../constant';

const numColumns = 2;
const halfWidth = width / numColumns;

class ProductList extends Component {
  state = {
    isDataFetched: false,
    dataProducts: [],
  };

  componentDidMount() {
    this.getProducts();
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
      this.getProducts();
    });
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  getProducts = () => {
    const productsRef = db.collection('produk');
    let products = [];
    productsRef
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          products.push({
            id_produk: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          isDataFetched: true,
          dataProducts: products,
        });
      })
      .catch(error => {
        console.error("Error getting product's collection \n", error);
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
          <View style={{ marginBottom: 20 }}>
            <FlatList
              data={dataProducts}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.navigation.navigate(urls.product, {
                      product_id: item.id_produk,
                    })
                  }>
                  <View style={styles.itemContainer}>
                    <Image source={{ uri: item.photo_produk[0] }} style={styles.productImage} />
                    <Text>{item.nama}</Text>
                    <StarRating
                      disabled
                      maxStars={5}
                      rating={parseInt(item.bintang, 10)}
                      starSize={15}
                      fullStarColor={'gold'}
                    />
                    <Text>Rp {convertToCurrency(parseInt(item.harga, 10))}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.id_produk}
              numColumns={numColumns}
            />
          </View>
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
