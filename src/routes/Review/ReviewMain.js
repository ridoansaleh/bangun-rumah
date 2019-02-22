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
  Right,
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
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Grid, Row, Col } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { urls } from '../../constant';
import Authentication from '../../components/Authentication';
// import emptyResult from '../../../assets/empty_search_result.png';
import { db } from '../../../firebase.config';
// import { convertToCurrency } from '../../utils';

const { width, height } = Dimensions.get('window');

class Review extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    idProduct: this.props.nav.navigation.getParam('product_id', 0),
    isDataFetched: false,
    isEligibleToReview: false,
    dataReview: [],
    text: '',
    starCount: 0,
  };

  componentDidMount() {
    this.getDataReviews();
  }

  getDataReviews = () => {
    let reviews = [];
    db.collection('review')
      .where('id_produk', '==', this.state.idProduct)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          reviews.push(doc.data());
        });
        this.checkHasUserBuyIt(reviews);
      })
      .catch(error => {
        console.error("Error getting review's data \n", error);
      });
  };

  checkHasUserReview = reviews => {
    // id_user and id_product from review table
    let data = [];
    db.collection('review')
      .where('id_user', '==', this.props.user.id)
      .where('id_produk', '==', this.state.idProduct)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        if (data.length === 1) {
          this.setState({
            dataReview: reviews,
            isDataFetched: true,
            isEligibleToReview: false,
          });
        } else {
          this.checkHasUserBuyIt(reviews);
        }
      })
      .catch(error => {
        console.error("Error getting searching review's data \n", error);
      });
  };

  checkHasUserBuyIt = reviews => {
    // id_user and id_product from pemesanan table
    let data = [];
    db.collection('pemesanan')
      .where('id_user', '==', this.props.user.id)
      .where('id_produk', '==', this.state.idProduct)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        if (data.length === 1) {
          this.setState({
            dataReview: reviews,
            isDataFetched: true,
            isEligibleToReview: true,
          });
        } else {
          this.setState({
            dataReview: reviews,
            isDataFetched: true,
            isEligibleToReview: false,
          });
        }
      })
      .catch(error => {
        console.error("Error getting searching pemesanan's data \n", error);
      });
  };

  submitReview = () => {
    // submit to firebase
  };

  //   checkIsUserEligibleToReview = () => {
  //     // check whether user has reviewed or not
  //     // check whether user buy the product or not
  //   };

  onStarRatingPress = () => {};

  render() {
    console.log('ReviewSTATE : ', this.state);
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Review</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ padding: 10 }}>
          {!this.state.isDataFetched && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
          {/* USER _NOT_ ELIGIBLE TO REVIEW */}
          {this.state.isDataFetched && !this.state.isEligibleToReview && (
            <View style={{ backgroundColor: '#FFC300', padding: 10, marginBottom: 15 }}>
              <Text style={{ color: 'white', fontSize: 13 }}>
                Hanya pengguna yang sudah pernah membeli produk ini yang dapat memberikan review
              </Text>
            </View>
          )}
          {/* USER ELIGIBLE TO MAKE REVIEW */}
          {this.state.isDataFetched && this.state.isEligibleToReview && (
            <Grid>
              <Row style={{ marginBottom: 15 }}>
                <Col size={15}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    starSize={18}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                  />
                </Col>
                <Col size={35}>
                  <Text style={{ position: 'absolute', right: 0 }}>Nama User</Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 15 }}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  onChangeText={val => this.setState({ text: val })}
                  value={this.state.text}
                  style={{ borderColor: 'black', borderWidth: 1, width: 0.95 * width, padding: 5 }}
                />
              </Row>
              <Row>
                <Button small onPress={() => this.submitReview()}>
                  <Text>Submit</Text>
                </Button>
              </Row>
            </Grid>
          )}
          {/* THERE ARE _NO_ REVIEW YET */}
          {this.state.isDataFetched && this.state.dataReview.length === 0 && (
            <View style={{ backgroundColor: '#0DA740', padding: 10, marginTop: 30 }}>
              <Text style={{ color: 'white', fontSize: 13 }}>
                Belum ada review. Silahkan berikan review pada produk ini dengan benar.
              </Text>
            </View>
          )}
          {/* THERE ARE SOME REVIEWS */}
          {this.state.isDataFetched && this.state.dataReview.length > 0 && (
            <View style={{ marginTop: 30 }}>
              {this.state.dataReview.map((rev, i) => (
                <Grid style={{ marginBottom: 10 }} key={i}>
                  <Row>
                    <Col size={38}>
                      <Text style={{ fontWeight: 'bold' }}>{rev.reviewer}</Text>
                    </Col>
                    <Col size={12}>
                      <StarRating
                        disabled
                        maxStars={5}
                        rating={parseInt(rev.bintang)}
                        starSize={18}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Text>{rev.teks}</Text>
                  </Row>
                </Grid>
              ))}
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    marginTop: (height * 0.75) / 2,
    marginBottom: (height * 0.75) / 2,
  },
});

export default Authentication(Review);
