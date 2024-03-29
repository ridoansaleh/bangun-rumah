import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text, View, Spinner } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';
import { db } from '../../../../../firebase.config';
import { getMonthName, width, height, convertToDate } from '../../../../utils';

class SellingStatistic extends Component {
  static propTypes = {
    shopId: PropTypes.string,
  };

  state = {
    isDataFetched: false,
    months: [],
    dataOrders: [],
  };

  componentDidMount() {
    this.getSellingStats();
  }

  getSellingStats = () => {
    let data = [];
    const thisYear = dayjs().year();
    const thisMonth = dayjs().month();
    const lastYear = dayjs()
      .subtract(1, 'year')
      .year();
    const sixMonthAgoFull = dayjs().subtract(6, 'month');
    const sixMonthAgoMonth = dayjs(sixMonthAgoFull).month() + 1;
    const yearOfSixMonthAgo = dayjs(sixMonthAgoFull).year();
    let isSameYear = false;
    let lastSixMonth = [];
    const isMonthShort = true;
    if (yearOfSixMonthAgo === thisYear) {
      isSameYear = true;
    }
    if (isSameYear) {
      for (let i = 0; i <= thisMonth; i++) {
        lastSixMonth.push(getMonthName(i, isMonthShort));
      }
    } else {
      for (let j = sixMonthAgoMonth; j <= 11; j++) {
        lastSixMonth.push(getMonthName(j, isMonthShort));
      }
      for (let k = 0; k <= thisMonth; k++) {
        lastSixMonth.push(getMonthName(k, isMonthShort));
      }
    }
    db.collection('pemesanan')
      .where('id_toko', '==', this.props.shopId)
      .where('status', '==', 'Diterima')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_visit: doc.id,
            ...doc.data(),
          });
        });
        let filteredData = data;
        if (isSameYear) {
          filteredData = data.map(d => {
            if (dayjs(d).year() === dayjs().year()) {
              return d;
            }
          });
        } else {
          let lastYearData = filteredData
            .map(d => {
              if (dayjs(d.waktu_pemesanan).year() === lastYear) {
                return d;
              }
            })
            .filter(r => r !== undefined);
          let thisYearData = filteredData
            .map(d => {
              if (dayjs(d.waktu_pemesanan).year() === dayjs().year()) {
                return d;
              }
            })
            .filter(r => r !== undefined);
          for (let l = sixMonthAgoMonth; l <= 11; l++) {
            lastYearData.map(d => {
              if (dayjs(d).month() === l) {
                filteredData.push(d);
              }
            });
          }
          for (let m = 0; m <= thisMonth; m++) {
            thisYearData.map(d => {
              if (dayjs(d).month() === m) {
                filteredData.push(d);
              }
            });
          }
        }
        let month1 = this.countMonthSellingStat(filteredData, lastSixMonth, 0);
        let month2 = this.countMonthSellingStat(filteredData, lastSixMonth, 1);
        let month3 = this.countMonthSellingStat(filteredData, lastSixMonth, 2);
        let month4 = this.countMonthSellingStat(filteredData, lastSixMonth, 3);
        let month5 = this.countMonthSellingStat(filteredData, lastSixMonth, 4);
        let month6 = this.countMonthSellingStat(filteredData, lastSixMonth, 5);
        let result = [month1, month2, month3, month4, month5, month6];
        this.setState({
          isDataFetched: true,
          months: lastSixMonth,
          dataOrders: result,
        });
      })
      .catch(error => {
        console.warn("Error getting visiting's data \n", error);
      });
  };

  countMonthSellingStat = (data, lastSixMonth, month) => {
    const totalSell = data.filter(d => {
      let date = convertToDate(d.waktu_pemesanan);
      if (lastSixMonth[month] === dayjs(date).format('MMM')) {
        return d;
      }
    }).length;
    return totalSell;
  };

  render() {
    const { isDataFetched, months, dataOrders } = this.state;
    return (
      <View style={{ padding: 10 }}>
        {!isDataFetched ? (
          <View style={styles.spin}>
            <Spinner color="green" size="large" />
          </View>
        ) : (
          <Grid>
            <Row>
              <Text>Grafik Penjualan Toko</Text>
            </Row>
            <Row>
              <LineChart
                data={{
                  labels: months,
                  datasets: [
                    {
                      data: dataOrders,
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

export default SellingStatistic;
