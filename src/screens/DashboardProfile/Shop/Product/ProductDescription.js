import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { convertToCurrency } from '../../../../utils';
import { urls } from '../../../../constant';

class ProductDescription extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  state = {
    shopId: this.props.data.id_toko,
    productName: this.props.data.nama,
    productPrice: this.props.data.harga,
    star: this.props.data.bintang,
    shopName: this.props.data.nama_toko,
    specs: [],
    isConstructed: false,
  };

  componentDidMount() {
    let arrNew = this.props.data.spesifikasi.split(',');
    let resArr = [];
    for (let i = 0; i < arrNew.length; i++) {
      resArr.push({
        id: i,
        text: arrNew[i],
      });
      if (i === arrNew.length - 1) {
        this.setState({
          isConstructed: true,
          specs: resArr,
        });
      }
    }
  }

  shopNameClick = id => {
    this.props.navigation.navigate(urls.shop, {
      id_toko: id,
    });
  };

  render() {
    if (!this.state.isConstructed) {
      return null;
    }
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ marginBottom: 20, fontWeight: 'bold' }}>{this.state.productName}</Text>
        <Grid>
          <Row style={{ marginBottom: 30 }}>
            <Text>{this.props.data.deskripsi}</Text>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Text>Rp {convertToCurrency(this.state.productPrice)}</Text>
          </Row>
          <Row style={{ marginBottom: 30 }}>
            <Col size={2}>
              <StarRating
                disabled
                maxStars={5}
                rating={this.state.star}
                starSize={20}
                fullStarColor={'gold'}
              />
            </Col>
            <Col size={4}>
              <TouchableOpacity onPress={() => this.shopNameClick(this.state.shopId)}>
                <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  {this.state.shopName}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Text style={{ fontWeight: 'bold' }}>Spesifikasi:</Text>
          </Row>
          <Row>
            <FlatList
              data={this.state.specs}
              renderItem={({ item, index }) => {
                return (
                  <Text>
                    {index + 1}. {item.text.trim()}
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

export default ProductDescription;
