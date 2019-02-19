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
} from 'native-base';
import StarRating from 'react-native-star-rating';
import Authentication from '../../components/Authentication';
import emptyResult from '../../../assets/empty_search_result.png';
import { db } from '../../../firebase.config';
import { convertToCurrency } from '../../utils';

const numColumns = 2;
const { width, height } = Dimensions.get('window');
const halfWidth = width / numColumns;

class SearchProductScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    category: this.props.nav.navigation.getParam('cat', 'Kategori Produk'),
    isDataFetched: false,
    dataProducts: [],
  };

  componentDidMount() {
    let products = [];
    db.collection('produk')
      .where('kategori', '==', this.state.category)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          products.push(doc.data());
        });
        this.setState({
          isDataFetched: true,
          dataProducts: products,
        });
      })
      .catch(error => {
        console.log(`Error getting products with category ${this.state.category} \n`, error);
      });
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
            <Title>{this.state.category}</Title>
          </Body>
        </Header>
        <Content>
          {!isDataFetched && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
          {isDataFetched && dataProducts.length > 0 && (
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
          )}
          {isDataFetched && dataProducts.length === 0 && (
            <View style={styles.emptyContainer}>
              <Image source={emptyResult} style={styles.emptyLogo} />
              <Text style={styles.emptyText}>Tidak ditemukan produk dengan</Text>
              <Text style={styles.emptyText}>kategori {category}</Text>
            </View>
          )}
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

export default Authentication(SearchProductScreen);
