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
    user: PropTypes.object,
  };

  state = {
    idProduct: this.props.nav.navigation.getParam('product_id', 0),
    idShop: this.props.nav.navigation.getParam('shop_id', 0),
    isDataFetched: false,
    isEligibleToReview: false,
    dataReview: [],
    text: '',
    starCount: 0,
    invalidForm: false,
    readyToUpdate: false,
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
          // reviews.push(doc.data());
          reviews.push({
            id_review: doc.id,
            ...doc.data(),
          });
        });
        this.orderReviewData(reviews);
        // this.checkHasUserReview(reviews);
      })
      .catch(error => {
        console.error("Error getting review's data \n", error);
      });
  };

  orderReviewData = reviews => {
    if (reviews.length > 0) {
      let newData = reviews.filter(rev => rev.id_user === this.props.user.id);
      console.log('newData : ', newData);
      if (newData.length === 1) {
        let temp = reviews.filter(rev => rev.id_user !== this.props.user.id);
        temp.unshift(newData);
        this.checkHasUserReview(temp);
      } else {
        this.checkHasUserReview(reviews);
      }
    } else {
      this.checkHasUserReview(reviews);
    }
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
        console.log('checkHasUserReview : ', data);
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
        console.log('checkHasUserBuyIt : ', data);
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

  changeFieldValue = (type, val) => {
    if (type === 'star') {
      if (this.state.text) {
        this.setState({
          starCount: val,
          invalidForm: false,
        });
      } else {
        this.setState({
          starCount: val,
          invalidForm: true,
        });
      }
    } else {
      if (this.state.starCount) {
        this.setState({
          text: val,
          invalidForm: false,
        });
      } else {
        this.setState({
          text: val,
          invalidForm: true,
        });
      }
    }
  };

  submitReview = () => {
    // submit to firebase
    if (this.state.starCount && this.state.text) {
      this.setState({
        invalidForm: false,
        isDataFetched: false,
      });
      db.collection('review')
        .add({
          id_produk: this.state.idProduct,
          id_toko: this.state.idShop,
          id_user: this.props.user.id,
          reviewer: this.props.user.nama,
          bintang: this.state.starCount,
          teks: this.state.text,
        })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id);
          this.getDataReviews();
        })
        .catch(error => {
          console.error('Error adding document: ', error);
        });
    } else {
      this.setState({
        invalidForm: true,
      });
    }
  };

  editReview = id => {
    if (this.state.starCount && this.state.text) {
      this.setState({
        invalidForm: false,
        readyToUpdate: false,
        isDataFetched: false,
      });

      let docRef = db.collection('review').doc(id);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            // this.setState({
            //   isDataFetched: true,
            //   dataProduct: doc.data(),
            // });
            docRef.update({
              bintang: this.state.starCount,
              teks: this.state.text,
            });
            this.getDataReviews();
          } else {
            console.log('No such document!');
          }
        })
        .catch(function(error) {
          console.log(`Error searching review with id ${id} \n`, error);
        });
    } else {
      this.setState({
        invalidForm: true,
      });
    }
  };

  //   checkIsUserEligibleToReview = () => {
  //     // check whether user has reviewed or not
  //     // check whether user buy the product or not
  //   };

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
                    selectedStar={val => this.changeFieldValue('star', val)}
                  />
                </Col>
                <Col size={35}>
                  <Text style={{ position: 'absolute', right: 0 }}>{this.props.user.nama}</Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: 15 }}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  onChangeText={val => this.changeFieldValue('text', val)}
                  value={this.state.text}
                  style={{ borderColor: 'black', borderWidth: 1, width: 0.95 * width, padding: 5 }}
                />
              </Row>
              {/* VALIDATION MESSAGE */}
              {this.state.invalidForm && (
                <Row style={{ marginBottom: 15 }}>
                  <Text style={{ color: 'red', fontSize: 12 }}>
                    Bintang dan teks tidak boleh kosong
                  </Text>
                </Row>
              )}
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
              {this.state.dataReview.map((rev, i) => {
                if (rev.id_user === this.props.user.id) {
                  return (
                    <Grid>
                      <Row>
                        <Col size={38}>
                          <Text style={{ fontWeight: 'bold' }}>{rev.reviewer}</Text>
                        </Col>
                        <Col size={12}>
                          {!this.state.readyToUpdate ? (
                            <StarRating
                              disabled
                              maxStars={5}
                              rating={parseInt(rev.bintang)}
                              starSize={18}
                            />
                          ) : (
                            <StarRating
                              disabled={false}
                              maxStars={5}
                              rating={parseInt(rev.bintang)}
                              starSize={18}
                              selectedStar={val => this.changeFieldValue('star', val)}
                            />
                          )}
                        </Col>
                      </Row>
                      <Row>
                        {!this.state.readyToUpdate ? (
                          <Text>{rev.teks}</Text>
                        ) : (
                          <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={val => this.changeFieldValue('text', val)}
                            value={this.state.text ? this.state.text : rev.teks}
                            style={{
                              borderColor: 'black',
                              borderWidth: 1,
                              width: 0.95 * width,
                              padding: 5,
                            }}
                          />
                        )}
                      </Row>
                      {!this.state.readyToUpdate && (
                        <Row>
                          <TouchableHighlight
                            onPress={() => this.setState({ readyToUpdate: true })}>
                            <Text>Review</Text>
                          </TouchableHighlight>
                        </Row>
                      )}
                      {/* <Row style={{ marginBottom: 15 }}>
                        <Col size={15}>
                          <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.starCount}
                            starSize={18}
                            selectedStar={val => this.changeFieldValue('star', val)}
                          />
                        </Col>
                        <Col size={35}>
                          <Text style={{ position: 'absolute', right: 0 }}>
                            {this.props.user.nama}
                          </Text>
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 15 }}>
                        <TextInput
                          multiline
                          numberOfLines={4}
                          onChangeText={val => this.changeFieldValue('text', val)}
                          value={this.state.text}
                          style={{
                            borderColor: 'black',
                            borderWidth: 1,
                            width: 0.95 * width,
                            padding: 5,
                          }}
                        />
                      </Row> */}
                      {/* VALIDATION MESSAGE */}
                      {this.state.readyToUpdate && this.state.invalidForm && (
                        <Row style={{ marginBottom: 15 }}>
                          <Text style={{ color: 'red', fontSize: 12 }}>
                            Bintang dan teks tidak boleh kosong
                          </Text>
                        </Row>
                      )}
                      {this.state.readyToUpdate && (
                        <Row>
                          <Button small onPress={() => this.editReview(rev.id_review)}>
                            <Text>Submit</Text>
                          </Button>
                        </Row>
                      )}
                    </Grid>
                  );
                } else {
                  return (
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
                  );
                }
              })}
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
