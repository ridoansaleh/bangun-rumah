import React, { Component } from 'react';
import { Dimensions, StyleSheet, FlatList, Image } from 'react-native';
import { View, Text } from 'native-base';
import StarRating from 'react-native-star-rating';
const defaultProduct = require('../../../assets/default-product.jpg');

const data = [
  { id: 'a', name: 'Nama Produk', value: 'Rp 200.000,00' },
  { id: 'b', name: 'Nama Produk', value: 'Rp 70.000,00' },
  { id: 'c', name: 'Nama Produk', value: 'Rp 56.000,00' },
  { id: 'd', name: 'Nama Produk', value: 'Rp 290.000,00' },
  { id: 'e', name: 'Nama Produk', value: 'Rp 300.000,00' },
  { id: 'f', name: 'Nama Produk', value: 'Rp 550.000,00' },
];

const numColumns = 2;
const size = Dimensions.get('window').width / numColumns;

class ProductList extends Component {
  render() {
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={defaultProduct} style={styles.productImage} />
            <Text>{item.name}</Text>
            <StarRating disabled maxStars={5} rating={4} starSize={20} fullStarColor={'gold'} />
            <Text>{item.value}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={numColumns}
      />
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: size,
    height: size,
    flex: 1,
    margin: 3,
    // backgroundColor: 'lightblue',
    alignItems: 'center',
  },
  productImage: {
    width: size * 0.7,
    height: size * 0.6,
    marginTop: 15,
  },
});

export default ProductList;
