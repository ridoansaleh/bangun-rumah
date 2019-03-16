import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, View, Spinner } from 'native-base';
import { Table, Row } from 'react-native-table-component';
import dayjs from 'dayjs';
import { db } from '../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ProductsReport extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    isDataFetched: false,
    tableHead: ['No', 'Nama', 'Tanggal Posting', 'Stok', 'Satuan', 'Terjual', 'Review'],
    widthArr: [40, 260, 220, 100, 120, 140, 120, 100, 200],
    dataProducts: [],
  };

  componentDidMount() {
    const shopId = this.props.nav.navigation.getParam('shopId', undefined);
    this.getProducts(shopId);
  }

  getProducts = id => {
    let data = [];
    db.collection('produk')
      .where('id_toko', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_produk: doc.id,
            ...doc.data(),
          });
        });
        const tableData = [];
        for (let i = 0; i < data.length; i += 1) {
          const rowData = [];
          for (let j = 0; j < 7; j += 1) {
            data[i].map((d, i) => {
              rowData.push(i + 1);
              if (d.nama) {
                rowData.push(d.nama);
              } else if (d.tanggal_posting) {
                rowData.push(dayjs(d.tanggal_posting).format('DD-MM-YYYY'));
              } else if (d.stok) {
                rowData.push(d.stok);
              } else if (d.satuan) {
                rowData.push(d.satuan);
              } else if (d.dibeli) {
                rowData.push(d.dibeli);
              } else if (d.bintang) {
                rowData.push('Bintang ', d.bintang);
              }
            });
          }
          tableData.push(rowData);
        }
        this.setState({
          isDataFetched: true,
          dataProducts: tableData,
        });
      })
      .catch(error => {
        console.error('Error getting shop products data \n', error);
      });
  };

  render() {
    const { tableHead, widthArr, dataProducts } = this.state;
    return (
      <View style={{ padding: 10 }}>
        {!this.state.isDataFetched ? (
          <View style={styles.spin}>
            <Spinner color="green" size="large" />
          </View>
        ) : (
          <View>
            <Text>Daftar Produk</Text>
            <ScrollView horizontal>
              <View>
                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                  <Row
                    data={tableHead}
                    widthArr={widthArr}
                    style={styles.header}
                    textStyle={styles.text}
                  />
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                    {dataProducts.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={widthArr}
                        style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                        textStyle={styles.text}
                      />
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
  header: {
    height: 50,
    backgroundColor: '#537791',
  },
  text: {
    textAlign: 'center',
    fontWeight: '100',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
    backgroundColor: '#E7E6E1',
  },
});

export default ProductsReport;
