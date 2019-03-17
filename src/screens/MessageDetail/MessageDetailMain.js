import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, Container, Content, Text, View, Form, Label, Item, Input } from 'native-base';
// import { Grid, Col } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import { db } from '../../../firebase.config';
// import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class MessageDetailScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataMessages: [],
    message: '',
    isMessageChanged: false,
    isMessageValid: false,
  };

  componentDidMount() {
    let user = 'shop';
    let type = 'id_toko';
    let reply = 'user';
    let replyType = 'id_user';
    let userId = this.props.nav.navigation.getParam('userId', undefined);
    let shopId = this.props.nav.navigation.getParam('shopId', undefined);
    let userReplyId = this.props.nav.navigation.getParam('userReplyId', undefined);
    let shopReplyId = this.props.nav.navigation.getParam('shopReplyId', undefined);
    if (!shopId) {
      user = userId;
      type = 'id_user';
    }
    if (!userReplyId) {
      reply = shopReplyId;
      replyType = 'id_toko';
    }
    this.getMessages(type, user, replyType, reply);
  }

  getMessages = (type1, user1, type2, user2) => {
    let data = [];
    db.collection('percakapan')
      .where(type1, '==', user1)
      .where(type2, '==', user2)
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

  handleChangeField = val => {
    if (val) {
      this.setState({
        message: val,
        isMessageChanged: true,
        isMessageValid: true,
      });
    } else {
      this.setState({
        message: val,
        isMessageChanged: true,
        isMessageValid: false,
      });
    }
  };

  sendMessage = () => {
    db.collection('percakapan')
      .add({
        id_user: this.props.user.id,
        id_toko: this.state.data[0].id_toko,
        pesan: this.state.message,
        photo: this.props.user.photo,
        nama_pengguna: this.props.user.nama, // need to fix
      })
      .then(docRef => {
        console.log('Successfully send message with id ', docRef.id);
        this.getMessages();
      })
      .catch(error => {
        console.error('Error sending message \n', error);
      });
  };

  render() {
    const { message, isMessageChanged, isMessageValid } = this.state;
    return (
      <Container>
        <Header {...this.props} title="Pesan" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : (
            <View>
              <View>
                {this.state.dataMessages.length > 0 ? (
                  this.state.dataMessages.map((d, i) => {
                    if (d.id_user === this.props.user.id) {
                      return (
                        <Text key={i} style={{ textAlign: 'left' }}>
                          {d.pesan}
                        </Text>
                      );
                    } else {
                      return (
                        <Text key={i} style={{ textAlign: 'right' }}>
                          {d.pesan}
                        </Text>
                      );
                    }
                  })
                ) : (
                  <Text>Tidak ada pesan</Text>
                )}
              </View>
              <Form>
                <Item floatingLabel error={isMessageChanged && !isMessageValid}>
                  <Label>Pesan</Label>
                  <Input value={message} onChangeText={val => this.handleChangeField(val)} />
                </Item>
                {isMessageChanged && !isMessageValid && (
                  <Item style={styles.errorBox}>
                    <Text style={styles.errorMessage}>{'Pesan tidak boleh kosong'}</Text>
                  </Item>
                )}
                <Button small style={{ width: width - 20 }} onPress={() => this.sendMessage()}>
                  <Text>Kirim</Text>
                </Button>
              </Form>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  errorBox: {
    borderBottomWidth: 0,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
  },
});

export default Authentication(MessageDetailScreen);
