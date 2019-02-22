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
  ScrollView,
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
  Form,
  Item,
  Label,
  Input,
  Spinner,
  ActionSheet,
  Tabs,
  Tab,
  Accordion,
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { urls } from '../../constant';
import Authentication from '../../components/Authentication';
// import emptyResult from '../../../assets/empty_search_result.png';
// import { db } from '../../../firebase.config';
// import { convertToCurrency } from '../../utils';

const { width, height } = Dimensions.get('window');

class Discussion extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  state = {
    text: '',
  };

  componentDidMount() {
    // console.log('');
  }

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
            <Title>Diskusi</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ padding: 10 }}>
          <Grid style={{ height: height * 0.87 }}>
            <Row size={25}>
              <Grid>
                <Row style={{ marginBottom: 15 }}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={text => this.setState({ text })}
                    value={this.state.text}
                    placeholder={'Tuliskan pertanyaan Anda kepada penjual di sini'}
                    style={{
                      borderColor: 'black',
                      borderWidth: 1,
                      width: 0.95 * width,
                      padding: 5,
                    }}
                  />
                </Row>
                <Row>
                  <Button small>
                    <Text>Komentar</Text>
                  </Button>
                </Row>
              </Grid>
            </Row>
            <Row size={75}>
              <ScrollView>
                <Grid style={{ marginBottom: 10 }}>
                  <Row>
                    <Text style={{ fontWeight: 'bold' }}>Nama User</Text>
                  </Row>
                  <Row>
                    <Text>Om, bisa COD gak nih barang ?</Text>
                  </Row>
                </Grid>
              </ScrollView>
            </Row>
          </Grid>
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

export default Authentication(Discussion);
