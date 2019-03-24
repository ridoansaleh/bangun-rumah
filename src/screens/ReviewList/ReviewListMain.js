import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import EmptyReview from '../../../assets/sad_face.png';
import { urls } from '../../constant';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ReviewListScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataReview: [],
  };

  componentDidMount() {
    this.getListReview(this.props.user.id);
  }

  getListReview = id => {
    let data = [];
    db.collection('review')
      .where('id_user', '==', id)
      .get()
      .then(querySnapshot => {
        const result = [];
        const map = new Map();
        querySnapshot.forEach(doc => {
          data.push({
            id_review: doc.id,
            ...doc.data(),
          });
        });
        if (data.length > 0) {
          for (const item of data) {
            if (!map.has(item.id_produk)) {
              map.set(item.id_produk, true);
              result.push(item);
            }
          }
          this.setState({
            isDataFetched: true,
            dataReview: result,
          });
        } else {
          this.setState({
            isDataFetched: true,
          });
        }
      })
      .catch(error => {
        console.error("Error searching review's data \n", error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Review List" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : this.state.dataReview.length > 0 ? (
            <FlatList
              data={this.state.dataReview}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.nav.navigation.navigate(urls.review, {
                      product_id: item.id_produk,
                      shop_id: item.id_toko,
                    })
                  }>
                  <Grid
                    style={{ width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1 }}>
                    <Row>
                      <Text>{item.reviewer}</Text>
                    </Row>
                    <Row>
                      <Text>{item.teks}</Text>
                    </Row>
                  </Grid>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.id_review}
              numColumns={1}
            />
          ) : (
            <View style={{ marginTop: 0.25 * height }}>
              <Image source={EmptyReview} style={styles.noReview} />
              <Text style={{ textAlign: 'center' }}>Belum ada riwayat Review</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  noReview: {
    height: 0.25 * height,
    width: 0.5 * width,
    marginBottom: 15,
    marginLeft: 0.25 * width,
  },
});

export default Authentication(ReviewListScreen);
