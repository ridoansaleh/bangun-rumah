import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, TouchableHighlight } from 'react-native';
import { Text, Icon } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { urls } from '../../../../constant';

const { height } = Dimensions.get('window');

class Interactions extends Component {
  static propTypes = {
    nav: PropTypes.object,
    data: PropTypes.object,
    idProduct: PropTypes.string,
  };

  render() {
    return (
      <View style={{ padding: 20 }}>
        <Grid style={{ padding: 5, height: height * 0.05, borderColor: 'black', borderWidth: 1 }}>
          <Col style={{ borderRightColor: 'black', borderRightWidth: 1 }}>
            <Grid>
              <Col size={4}>
                <TouchableHighlight
                  onPress={() => {
                    this.props.navigation.navigate(urls.review, {
                      product_id: this.props.idProduct,
                      shop_id: this.props.data.id_toko,
                    });
                  }}>
                  <Text>Review</Text>
                </TouchableHighlight>
              </Col>
              <Col size={1}>
                <View>
                  <Icon name="arrow-dropdown" />
                </View>
              </Col>
            </Grid>
          </Col>
          <Col>
            <Grid>
              <Col size={4}>
                <TouchableHighlight
                  onPress={() => {
                    this.props.navigation.navigate(urls.discussion, {
                      product_id: this.props.idProduct,
                      shop_id: this.props.data.id_toko,
                    });
                  }}>
                  <Text style={{ marginLeft: 5 }}>Diskusi</Text>
                </TouchableHighlight>
              </Col>
              <Col size={1}>
                <View>
                  <Icon name="arrow-dropdown" />
                </View>
              </Col>
            </Grid>
          </Col>
        </Grid>
      </View>
    );
  }
}

export default Interactions;
