import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  Header,
  Left,
  Button,
  Icon,
  Title,
  Body,
  Spinner,
  ActionSheet,
  Tabs,
  Tab,
  Accordion,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Grid, Row, Col } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { urls } from '../../constant';
// import Authentication from '../../components/Authentication';
// import emptyResult from '../../../assets/empty_search_result.png';
// import { db } from '../../../firebase.config';
// import { convertToCurrency } from '../../utils';

// const numColumns = 2;
const { width, height } = Dimensions.get('window');

// const Tab1 = () => (
//   <View>
//     <Text>
//       Tabs are a horizontal region of buttons or links that allow for a consistent navigation
//       experience between screens.
//     </Text>
//   </View>
// );

// const Tab2 = () => (
//   <View>
//     <Text>
//       It can contain any combination of text and icons, and is a popular method for enabling mobile
//       navigation.
//     </Text>
//   </View>
// );

const review = [{ title: 'Review', content: 'Lorem ipsum dolor sit amet' }];

const discuss = [{ title: 'Diskusi', content: 'Lorem ipsum dolor sit amet' }];

class Interactions extends Component {
  static propTypes = {
    nav: PropTypes.object,
    data: PropTypes.object,
    idProduct: PropTypes.string,
  };

  render() {
    console.log('PROPS : ', this.props);
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
                    this.props.navigation.navigate(urls.discussion);
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
