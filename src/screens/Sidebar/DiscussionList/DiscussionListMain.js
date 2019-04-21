import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import EmptyDiscussion from '../../../../assets/sad_face.png';
import { urls } from '../../../constant';
import { db } from '../../../../firebase.config';

const { width, height } = Dimensions.get('window');

class DiscussionListScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataDiscussion: [],
  };

  componentDidMount() {
    this.getListDiscussion(this.props.user.id);
  }

  getListDiscussion = id => {
    let data = [];
    db.collection('diskusi')
      .where('id_user', '==', id)
      .get()
      .then(querySnapshot => {
        const result = [];
        const map = new Map();
        querySnapshot.forEach(doc => {
          data.push({
            id_diskusi: doc.id,
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
            dataDiscussion: result,
          });
        } else {
          this.setState({
            isDataFetched: true,
          });
        }
      })
      .catch(error => {
        console.error("Error searching discussion's data \n", error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Riwayat Diskusi" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : this.state.dataDiscussion.length > 0 ? (
            <FlatList
              data={this.state.dataDiscussion}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.nav.navigation.navigate(urls.discussion, {
                      product_id: item.id_produk,
                      shop_id: item.id_toko,
                    })
                  }>
                  <Grid
                    style={{ width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1 }}>
                    <Row>
                      <Text>{item.nama_pelanggan}</Text>
                    </Row>
                    <Row>
                      <Text>{item.komentar}</Text>
                    </Row>
                  </Grid>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.id_diskusi}
              numColumns={1}
            />
          ) : (
            <View style={{ marginTop: 0.25 * height }}>
              <Image source={EmptyDiscussion} style={styles.noDiscussion} />
              <Text style={{ textAlign: 'center' }}>Belum ada riwayat Diskusi</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  noDiscussion: {
    height: 0.25 * height,
    width: 0.5 * width,
    marginBottom: 15,
    marginLeft: 0.25 * width,
  },
});

export default Authentication(DiscussionListScreen);
