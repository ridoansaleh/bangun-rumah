import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import Loading from '../../components/Loading';
import EmptyNotification from '../../../assets/sad_face.png';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class NotificationScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataNotification: [],
  };

  componentDidMount() {
    this.getNotifications(this.props.user.id);
  }

  getNotifications = id => {
    let data = [];
    db.collection('notifikasi')
      .where('penerima', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_notifikasi: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          isDataFetched: true,
          dataNotification: data,
        });
      })
      .catch(error => {
        console.error("Error searching notification's data \n", error);
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Notifikasi" />
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched ? (
            <Loading />
          ) : this.state.dataNotification.length > 0 ? (
            <FlatList
              data={this.state.dataNotification}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback>
                  <Grid
                    style={{ width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1 }}>
                    <Row>
                      <Text>{item.jenis}</Text>
                    </Row>
                    <Row>
                      <Text>{item.teks}</Text>
                    </Row>
                    <Text style={{ textAlign: 'right' }}>{item.waktu}</Text>
                  </Grid>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.id_diskusi}
              numColumns={1}
            />
          ) : (
            <View style={{ marginTop: 0.25 * height }}>
              <Image source={EmptyNotification} style={styles.noNotification} />
              <Text style={{ textAlign: 'center' }}>Belum ada notifikasi</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  noNotification: {
    height: 0.25 * height,
    width: 0.5 * width,
    marginBottom: 15,
    marginLeft: 0.25 * width,
  },
});

export default Authentication(NotificationScreen);
