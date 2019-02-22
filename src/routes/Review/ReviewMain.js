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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Grid, Row, Col } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { urls } from '../../constant';
import Authentication from '../../components/Authentication';
// import emptyResult from '../../../assets/empty_search_result.png';
// import { db } from '../../../firebase.config';
// import { convertToCurrency } from '../../utils';

const { width, height } = Dimensions.get('window');

class Review extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    text: '',
    starCount: 0,
  };

  componentDidMount() {
    // console.log('');
  }

  onStarRatingPress = () => {};

  render() {
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
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
                style={{ borderColor: 'black', borderWidth: 1, width: 0.95 * width, padding: 5 }}
              />
            </Row>
            <Row>
              <Button small>
                <Text>Submit</Text>
              </Button>
            </Row>
          </Grid>
          <View style={{ marginTop: 30 }}>
            <Grid style={{ marginBottom: 10 }}>
              <Row>
                <Col size={38}>
                  <Text style={{ fontWeight: 'bold' }}>Nama User</Text>
                </Col>
                <Col size={12}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    starSize={18}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                  />
                </Col>
              </Row>
              <Row>
                <Text>
                  Lumayan bagus nih barang. Rumah gw udah kena gempa 4 kali, belum hancur juga nih
                  jendela.
                </Text>
              </Row>
            </Grid>
            <Grid style={{ marginBottom: 10 }}>
              <Row>
                <Col size={38}>
                  <Text style={{ fontWeight: 'bold' }}>Nama User</Text>
                </Col>
                <Col size={12}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    starSize={18}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                  />
                </Col>
              </Row>
              <Row>
                <Text>
                  Lumayan bagus nih barang. Rumah gw udah kena gempa 4 kali, belum hancur juga nih
                  jendela.
                </Text>
              </Row>
            </Grid>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default Authentication(Review);
