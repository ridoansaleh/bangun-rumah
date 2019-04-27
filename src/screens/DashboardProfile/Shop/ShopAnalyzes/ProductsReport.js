import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, Spinner } from 'native-base';
import { Table, Row } from 'react-native-table-component';
import { convertToDate, width, height } from '../../../../utils';
import { db } from '../../../../../firebase.config';

class ProductsReport extends Component {
  static propTypes = {
    shopId: PropTypes.string,
  };

  state = {
    isDataFetched: false,
    tableHead: ['No', 'Nama', 'Tanggal Posting', 'Stok', 'Satuan', 'Terjual', 'Review'],
    widthArr: [40, 260, 220, 100, 120, 140, 200],
    dataProducts: [],
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = () => {
    let data = [];
    db.collection('produk')
      .where('id_toko', '==', this.props.shopId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push({
            id_produk: doc.id,
            ...doc.data(),
          });
        });
        let tableData = [];
        let rowData = [];
        let filteredRowData = [];
        for (let i = 0; i < data.length; i++) {
          rowData = Object.keys(data[i]).map(d => {
            if (d === 'id_produk') {
              return {
                no: i + 1,
              };
            } else if (d === 'nama') {
              return {
                nama: data[i]['nama'],
              };
            } else if (d === 'tanggal_posting') {
              return {
                tanggal: convertToDate(data[i]['tanggal_posting']),
              };
            } else if (d === 'stok') {
              return {
                stok: data[i]['stok'].toString(),
              };
            } else if (d === 'satuan') {
              return {
                satuan: data[i]['satuan'],
              };
            } else if (d === 'dibeli') {
              return {
                dibeli: data[i]['dibeli'],
              };
            } else if (d === 'bintang') {
              return {
                review: 'Bintang ' + data[i]['bintang'],
              };
            }
          });
          filteredRowData = rowData.filter(d => {
            if (d !== undefined) {
              return d;
            }
          });
          const orderData = [
            filteredRowData[0].no,
            filteredRowData[3].nama,
            filteredRowData[6].tanggal,
            filteredRowData[5].stok,
            filteredRowData[4].satuan,
            filteredRowData[2].dibeli,
            filteredRowData[1].review,
          ];
          tableData.push(orderData);
        }
        if (data.length > 0) {
          this.setState({
            isDataFetched: true,
            dataProducts: tableData,
          });
        } else {
          this.setState({
            isDataFetched: true,
          });
        }
      })
      .catch(error => {
        console.error('Error getting shop products data \n', error);
      });
  };

  render() {
    const { isDataFetched, tableHead, widthArr, dataProducts } = this.state;
    return (
      <View style={{ padding: 10 }}>
        {!isDataFetched ? (
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
                    {dataProducts.length > 0 ? (
                      dataProducts.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={widthArr}
                          style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                          textStyle={styles.text}
                        />
                      ))
                    ) : (
                      <View style={{ width: 1 * width, justifyContent: 'center' }}>
                        <Text>Belum ada produk</Text>
                      </View>
                    )}
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
