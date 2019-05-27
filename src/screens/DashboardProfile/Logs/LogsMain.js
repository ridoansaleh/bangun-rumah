import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Container, Content, Text, View } from 'native-base';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import { db } from '../../../../firebase.config';
import { convertToDate } from '../../../utils';

class LogScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    dataLogs: [],
  };

  componentDidMount() {
    this.getDataLogs(this.props.user.id);
  }

  getDataLogs = id => {
    let data = [];
    db.collection('log_user')
      .where('id_user', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const resp = doc.data();
          data.push({
            id_logs: doc.id,
            waktu_login: convertToDate(resp.terakhir_login, 'en'),
            ...resp,
          });
        });
        let result = [];
        if (data.length > 0) {
          let dataSorted = data.sort((a, b) => {
            let c = new Date(a.waktu_login);
            let d = new Date(b.waktu_login);
            return d - c;
          });
          result = dataSorted.map(d => {
            let original = d.perangkat.split('-');
            let perangkat = original[1].split('"').indexOf('android') > -1 ? 'Android' : 'iOS';
            return {
              title: `Terakhir login pada ${convertToDate(d.terakhir_login)}`,
              content: `Perangkat : ${perangkat} \nLokasi: ${d.lokasi}`,
            };
          });
        }
        this.setState({
          isDataFetched: true,
          dataLogs: result,
        });
      })
      .catch(error => {
        console.warn('Error getting user logs \n', error);
      });
  };

  render() {
    const { isDataFetched, dataLogs } = this.state;
    return (
      <Container>
        <Header {...this.props} title="Logs" />
        <Content>
          {!isDataFetched && <Loading />}
          {dataLogs.length > 0 ? (
            <Accordion
              dataArray={dataLogs}
              headerStyle={{ backgroundColor: 'white' }}
              contentStyle={{ backgroundColor: 'white', fontSize: 13 }}
            />
          ) : (
            <View>
              <Text style={{ textAlign: 'center' }}>Tidak ada data logs</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default Authentication(LogScreen);
