import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Picker } from 'react-native';
import { Button, Text, View, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';
import { db } from '../../../firebase.config';
import { getMonthName } from '../../utils';
// import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class UserVisitStatistic extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    time: 'Minggu',
    months: [],
    dataVisit: [],
  };

  componentDidMount() {
    this.getUserVisitStats();
  }

  getUserVisitStats = () => {
    let data = [];
    const thisYear = dayjs().year();
    const lastYear = thisYear - 1;
    const thisMonth = dayjs().month();
    const sixMonthAgo = dayjs().subtract(6, 'month');
    const sixMonthAgoShort = dayjs(sixMonthAgo).year();
    let isSameYear = false;
    let sixLastMonths = [];
    if (sixMonthAgoShort === thisYear) {
      isSameYear = true;
    }
    if (isSameYear) {
      for (let i = 0; i <= thisMonth.length; i++) {
        sixLastMonths.push(getMonthName(i));
      }
    } else {
      for (let j = sixMonthAgoShort; j <= 11; j++) {
        sixLastMonths.push(getMonthName(j));
      }
      for (let k = 0; k <= thisMonth.length; k++) {
        sixLastMonths.push(getMonthName(k));
      }
    }
    db.collection('kunjungan')
      .where('id_toko', '==', 0)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_visit: doc.id,
            ...doc.data(),
          });
        });
        let fiteredData = data;
        if (isSameYear) {
          fiteredData = data.map(d => {
            if (dayjs(d).year() === dayjs().year()) {
              return d;
            }
          });
        } else {
          let lastYearData = fiteredData.map(d => {
            if (dayjs(d).year() === lastYear) {
              return d;
            }
          });
          let thisYearData = fiteredData.map(d => {
            if (dayjs(d).year() === dayjs().year()) {
              return d;
            }
          });
          for (let l = sixMonthAgoShort; l <= 11; l++) {
            lastYearData.map(d => {
              if (dayjs(d).month() === l) {
                fiteredData.push(d);
              }
            });
          }
          for (let m = 0; m <= thisMonth.length; m++) {
            thisYearData.map(d => {
              if (dayjs(d).month() === m) {
                fiteredData.push(d);
              }
            });
          }
        }
        let month1 = fiteredData.filter(d => sixLastMonths[0] === dayjs(d.tanggal).month()).length;
        let month2 = fiteredData.filter(d => sixLastMonths[1] === dayjs(d.tanggal).month()).length;
        let month3 = fiteredData.filter(d => sixLastMonths[2] === dayjs(d.tanggal).month()).length;
        let month4 = fiteredData.filter(d => sixLastMonths[3] === dayjs(d.tanggal).month()).length;
        let month5 = fiteredData.filter(d => sixLastMonths[4] === dayjs(d.tanggal).month()).length;
        let month6 = fiteredData.filter(d => sixLastMonths[5] === dayjs(d.tanggal).month()).length;
        let result = [month1, month2, month3, month4, month5, month6];
        this.setState({
          isDataFetched: true,
          months: sixLastMonths,
          dataVisit: result,
        });
      })
      .catch(error => {
        console.error("Error getting visiting's data \n", error);
      });
  };

  handleChangeTime = val => {
    this.setState({ time: val });
  };

  printVisitStats = () => {
    //
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        {!this.state.isDataFetched ? (
          <View style={styles.spin}>
            <Spinner color="green" size="large" />
          </View>
        ) : (
          <View>
            <Grid>
              <Row>
                <Text>Grafik Kunjungan User</Text>
              </Row>
              <Row>
                <LineChart
                  data={{
                    labels: this.state.months,
                    datasets: [
                      {
                        data: this.state.dataVisit,
                      },
                    ],
                  }}
                  width={width - 20}
                  height={0.25 * height}
                  chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </Row>
            </Grid>
            <Grid>
              <Row>
                <Col>
                  <Picker
                    selectedValue={this.state.time}
                    style={{ width: 0.65 * width, height: 25 }}
                    onValueChange={(itemValue, itemIndex) => this.handleChangeTime(itemValue)}>
                    <Picker.Item label={'Minggu'} value={'Minggu'} />
                    <Picker.Item label={'Bulan ini'} value={'Bulan ini'} />
                    <Picker.Item label={'2 Bulan Terakhir'} value={'2 Bulan Terakhir'} />
                    <Picker.Item label={'3 Bulan Terakhir'} value={'3 Bulan Terakhir'} />
                    <Picker.Item label={'4 Bulan Terakhir'} value={'4 Bulan Terakhir'} />
                    <Picker.Item label={'5 Bulan Terakhir'} value={'5 Bulan Terakhir'} />
                    <Picker.Item label={'6 Bulan Terakhir'} value={'6 Bulan Terakhir'} />
                  </Picker>
                </Col>
                <Col>
                  <Button small>
                    <Text>Cetak</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
});

export default UserVisitStatistic;
