import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { Button, Container, Content, Text, View } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import { db } from '../../../firebase.config';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class MessageScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    shopId: this.props.nav.navigation.getParam('shopId', undefined),
    userId: this.props.nav.navigation.getParam('userId', undefined),
    dataMessages: [],
  };

  componentDidMount() {
    const { shopId, userId } = this.state;
    let typeId = 'shop';
    let finalId = shopId;
    if (!shopId) {
      typeId = 'user';
      finalId = userId;
    }
    this.getMessages(typeId, finalId);
  }

  getMessages = (type, id) => {
    let data = [];
    let field = type === 'shop' ? 'id_toko' : 'id_user';
    db.collection('percakapan')
      .where(field, '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_percakapan: doc.id,
            ...doc.data(),
          });
        });
        if (data.length > 0) {
          this.setState({
            isDataFetched: true,
            dataMessages: data,
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
          ) : (
            <FlatList
              data={this.state.dataMessages}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.navigation.navigate(urls.product, {
                      userReplyId: item.id_user,
                      shopReplyId: item.id_toko,
                      shopId: this.state.shopId,
                      userId: this.state.userId,
                    })
                  }>
                  <Grid style={{ width: width - 20 }}>
                    <Row>
                      <Text>{item.nama_pengguna}</Text>
                    </Row>
                    <Row>
                      <Col>
                        <Image source={{ uri: item.photo }} />
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
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default Authentication(MessageScreen);
