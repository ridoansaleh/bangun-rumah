import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Content, Text, Form, Label, Item, Input } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import { db } from '../../../../firebase.config';
import { convertToDate, width, height } from '../../../utils';

class MessageDetailScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataMessages: [],
    message: '',
    isMessageChanged: false,
    isMessageValid: false,
    userId: this.props.nav.navigation.getParam('userId', undefined),
    shopId: this.props.nav.navigation.getParam('shopId', undefined),
    shop: this.props.nav.navigation.getParam('shop', undefined),
    replyId: this.props.nav.navigation.getParam('replyId', undefined),
    chatType: this.props.nav.navigation.getParam('chatType', undefined),
  };

  componentDidMount() {
    const { userId, shopId, replyId, chatType } = this.state;
    let sender = shopId;
    let receiver = replyId;

    if (chatType !== 'shopChatting') {
      sender = userId;
    }
    this.getMessageFromSender(sender, receiver);
  }

  getMessageFromSender = (user1, user2) => {
    let data = [];
    db.collection('percakapan')
      .where('id_pengirim', '==', user1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_percakapan: doc.id,
            ...doc.data(),
          });
        });
        this.getMessageFromReceiver(data, user2);
      })
      .catch(error => {
        console.error("Error searching messages's data \n", error);
      });
  };

  getMessageFromReceiver = (res, receiver) => {
    let data = [];
    db.collection('percakapan')
      .where('id_pengirim', '==', receiver)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_percakapan: doc.id,
            ...doc.data(),
          });
        });
        if (data.length > 0) {
          let result = res.length > 0 ? [...res, ...data] : data;
          result.sort((a, b) => {
            let c = new Date(convertToDate(a.waktu));
            let d = new Date(convertToDate(b.waktu));
            return c - d;
          });
          this.setState({
            isDataFetched: true,
            dataMessages: result,
          });
        } else {
          this.setState({
            isDataFetched: true,
            dataMessages: res,
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
        id_pengirim: this.state.chatType === 'shopChatting' ? this.state.shopId : this.state.userId,
        id_penerima: this.state.replyId,
        pesan: this.state.message,
        photo:
          this.state.chatType === 'shopChatting' ? this.state.shop.photo : this.props.user.photo,
        nama_pengguna:
          this.state.chatType === 'shopChatting' ? this.state.shop.nama : this.props.user.nama,
        waktu: new Date(),
      })
      .then(docRef => {
        console.log('Successfully send message with id ', docRef.id);
        const { userId, shopId, replyId, chatType } = this.state;
        let sender = shopId;
        let receiver = replyId;

        if (chatType !== 'shopChatting') {
          sender = userId;
        }
        this.getMessageFromSender(sender, receiver);
        this.setState({
          message: '',
          isMessageChanged: false,
          isMessageValid: false,
        });
      })
      .catch(error => {
        console.error('Error sending message \n', error);
      });
  };

  render() {
    const { message, isMessageChanged, isMessageValid, chatType, userId, shopId } = this.state;
    const idDiff = chatType === 'shopChatting' ? shopId : userId;
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header {...this.props} title="Pesan" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : (
            <Grid>
              <Row style={{ height: height * 0.7 }}>
                <ScrollView>
                  {this.state.dataMessages.length > 0 ? (
                    this.state.dataMessages.map((d, i) => {
                      if (d.id_penerima === idDiff) {
                        return (
                          <Text key={i} style={{ textAlign: 'left', marginBottom: 15 }}>
                            {d.pesan}
                          </Text>
                        );
                      } else {
                        return (
                          <Text key={i} style={{ textAlign: 'right', marginBottom: 15 }}>
                            {d.pesan}
                          </Text>
                        );
                      }
                    })
                  ) : (
                    <Text style={{ textAlign: 'center' }}>Tidak ada pesan</Text>
                  )}
                </ScrollView>
              </Row>
              <Row style={{ height: height * 0.2, marginBottom: 25 }}>
                <Form>
                  <Item
                    floatingLabel
                    error={isMessageChanged && !isMessageValid}
                    style={{ marginBottom: 15 }}>
                    <Label>Pesan</Label>
                    <Input value={message} onChangeText={val => this.handleChangeField(val)} />
                  </Item>
                  {isMessageChanged && !isMessageValid && (
                    <Item style={styles.errorBox}>
                      <Text style={styles.errorMessage}>{'Pesan tidak boleh kosong'}</Text>
                    </Item>
                  )}
                  {isMessageValid ? (
                    <Button small style={styles.submitBtn} onPress={() => this.sendMessage()}>
                      <Text>Kirim</Text>
                    </Button>
                  ) : (
                    <Button small style={styles.submitBtn} disabled>
                      <Text>Kirim</Text>
                    </Button>
                  )}
                </Form>
              </Row>
            </Grid>
          )}
        </Content>
      </KeyboardAwareScrollView>
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
  submitBtn: {
    width: width - 20,
    justifyContent: 'center',
  },
});

export default Authentication(MessageDetailScreen);
