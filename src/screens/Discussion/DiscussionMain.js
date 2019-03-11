import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions, TextInput, ScrollView } from 'react-native';
import { Container, Content, Text, Button } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { urls } from '../../constant';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class DiscussionScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
    isLogin: PropTypes.bool,
  };

  state = {
    isDataFetched: false,
    idProduct: this.props.nav.navigation.getParam('product_id', 0),
    idShop: this.props.nav.navigation.getParam('shop_id', 0),
    dataDiscussion: [],
    comment: '',
    invalidForm: false,
  };

  componentDidMount() {
    this.getDataDiscussion();
  }

  getDataDiscussion = () => {
    let discussion = [];
    db.collection('diskusi')
      .where('id_produk', '==', this.state.idProduct)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          discussion.push({
            id_discussion: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          isDataFetched: true,
          dataDiscussion: discussion,
        });
      })
      .catch(error => {
        console.error("Error getting discussion's data \n", error);
      });
  };

  submitComment = () => {
    if (this.state.comment) {
      this.setState({
        invalidForm: false,
        isDataFetched: false,
        comment: '',
      });
      db.collection('diskusi')
        .add({
          id_produk: this.state.idProduct,
          id_toko: this.state.idShop,
          id_user: this.props.user.id,
          komentar: this.state.comment,
          nama_pelanggan: this.props.user.nama,
        })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id);
          this.getDataDiscussion();
        })
        .catch(error => {
          console.error('Error adding document: ', error);
        });
    } else {
      this.setState({
        invalidForm: true,
      });
    }
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Diskusi" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched && <Loading />}
          <Grid style={{ height: height * 0.87 }}>
            {this.state.isDataFetched && this.props.isLogin && (
              <Row size={25}>
                <Grid>
                  <Row style={{ marginBottom: 15 }}>
                    <TextInput
                      multiline
                      numberOfLines={4}
                      onChangeText={val => this.setState({ comment: val, invalidForm: false })}
                      value={this.state.comment}
                      placeholder={'Tuliskan pertanyaan Anda kepada penjual di sini'}
                      style={{
                        borderColor: 'black',
                        borderWidth: 1,
                        width: -20 + width,
                        padding: 5,
                      }}
                    />
                  </Row>
                  {this.state.invalidForm && (
                    <Row>
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        Komentar tidak boleh kosong.
                      </Text>
                    </Row>
                  )}
                  <Row>
                    <Button small onPress={() => this.submitComment()}>
                      <Text>Komentar</Text>
                    </Button>
                  </Row>
                </Grid>
              </Row>
            )}
            {this.state.isDataFetched && !this.props.isLogin && (
              <Row
                size={20}
                style={{ borderColor: 'black', borderWidth: 1, padding: 5, marginBottom: 15 }}>
                <Grid>
                  <Row style={{ flex: 1, justifyContent: 'center', marginBottom: 10 }}>
                    <Text>Kamu belum bisa komentar karena belum login</Text>
                  </Row>
                  <Row>
                    <Button
                      small
                      style={{
                        width: 0.3 * width - 20,
                        marginLeft: 0.35 * width - 20,
                        marginRight: 0.35 * width - 20,
                      }}
                      onPress={() => this.props.nav.navigation.navigate(urls.login)}>
                      <Text>Login</Text>
                    </Button>
                  </Row>
                </Grid>
              </Row>
            )}
            <Row size={75}>
              <ScrollView>
                {this.state.isDataFetched && this.state.dataDiscussion.length > 0 && (
                  <View>
                    {this.state.dataDiscussion.map((data, i) => (
                      <Grid style={{ marginBottom: 10 }} key={i}>
                        <Row>
                          <Text style={{ fontWeight: 'bold' }}>{data.nama_pelanggan}</Text>
                        </Row>
                        <Row>
                          <Text>{data.komentar}</Text>
                        </Row>
                      </Grid>
                    ))}
                  </View>
                )}
                {this.state.isDataFetched && this.state.dataDiscussion.length === 0 && (
                  <View style={{ backgroundColor: '#0DA740', marginTop: 15, padding: 5 }}>
                    <Text style={{ fontSize: 12, color: 'white' }}>
                      Belum ada komentar. Silahkan bertanya pada penjual mengenai barang ini.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default Authentication(DiscussionScreen);
