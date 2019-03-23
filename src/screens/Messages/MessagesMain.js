import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import { db } from '../../../firebase.config';
import NoMessage from '../../../assets/no_message.png';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class MessageScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    shopId: this.props.nav.navigation.getParam('shopId', undefined),
    shop: this.props.nav.navigation.getParam('shop', undefined),
    chatType: this.props.nav.navigation.getParam('chatType', undefined),
    dataMessages: [],
  };

  componentDidMount() {
    const { shopId, chatType } = this.state;
    let id = shopId;

    if (chatType !== 'shopChatting') {
      id = this.props.user.id;
    }
    this.getMessages(id);
  }

  getMessages = id => {
    let data = [];
    db.collection('percakapan')
      .where('id_penerima', '==', id)
      .get()
      .then(querySnapshot => {
        const result = [];
        const map = new Map();
        querySnapshot.forEach(doc => {
          data.push({
            id_percakapan: doc.id,
            ...doc.data(),
          });
        });
        if (data.length > 0) {
          for (const item of data) {
            if (!map.has(item.id_penerima)) {
              map.set(item.id_penerima, true);
              result.push(item);
            }
          }
          this.setState({
            isDataFetched: true,
            dataMessages: result,
          });
        } else {
          this.setState({
            isDataFetched: true,
          });
        }
      })
      .catch(error => {
        console.error("Error searching messages's data \n", error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Chatting" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : this.state.dataMessages.length > 0 ? (
            <FlatList
              data={this.state.dataMessages}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.nav.navigation.navigate(urls.message_detail, {
                      shopId: this.state.shopId,
                      shop: this.state.shop,
                      userId: this.props.user.id,
                      chatType: this.state.chatType,
                      replyId: item.id_pengirim,
                    })
                  }>
                  <Grid
                    style={{ width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1 }}>
                    <Row>
                      <Text>{item.nama_pengguna}</Text>
                    </Row>
                    <Row>
                      <Col style={{ width: 0.3 * width }}>
                        <Image
                          source={{ uri: item.photo }}
                          style={{ height: 50, width: 50, marginBottom: 5 }}
                        />
                      </Col>
                      <Col>
                        <Text>{item.pesan}</Text>
                      </Col>
                    </Row>
                  </Grid>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.id_percakapan}
              numColumns={1}
            />
          ) : (
            <View style={{ marginTop: 0.25 * height }}>
              <Image source={NoMessage} style={styles.noMessage} />
              <Text style={{ textAlign: 'center' }}>Belum ada riwayat Pesan</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  noMessage: {
    height: 0.25 * height,
    width: 0.5 * width,
    marginBottom: 15,
    marginLeft: 0.25 * width,
  },
});

export default Authentication(MessageScreen);
